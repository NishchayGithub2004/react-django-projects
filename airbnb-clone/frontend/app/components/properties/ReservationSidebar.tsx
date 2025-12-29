'use client';

import { useState, useEffect } from 'react'; // import React hooks to manage local state and lifecycle side effects
import { Range } from 'react-date-range'; // import Range type to strongly type date range selection state
import { differenceInDays, eachDayOfInterval, format } from 'date-fns'; // import date utilities to calculate nights, expand date ranges, and format dates
import DatePicker from '../forms/Calendar'; // import calendar component to allow users to select reservation dates
import apiService from '@/app/services/apiService'; // import API service abstraction to communicate with reservation-related backend endpoints
import useLoginModal from '@/app/hooks/useLoginModal'; // import custom hook to prompt user login when required

const initialDateRange = { // define initial date range to preselect current day for both start and end
    startDate: new Date(), // set default check-in date to today
    endDate: new Date(), // set default check-out date to today
    key: 'selection' // define selection key required by react-date-range
}

export type Property = { // define property type to strictly describe reservation-relevant property data
    id: string; // store unique identifier of the property
    guests: number; // store maximum number of guests allowed for the property
    price_per_night: number; // store nightly price used to calculate total cost
}

interface ReservationSidebarProps { // define props interface for reservation sidebar configuration
    userId: string | null, // store current user id or null when user is not authenticated
    property: Property // store property data needed to calculate pricing and guest limits
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({ // define a functional component named 'ReservationSidebar' to manage booking logic and pricing which takes following props
    property, // receive property details to calculate guests range and pricing
    userId // receive user id to determine whether booking actions are allowed
}) => {
    const loginModal = useLoginModal(); // initialize login modal hook to prompt authentication when necessary

    const [fee, setFee] = useState<number>(0); // store additional service or platform fee applied to the reservation
    const [nights, setNights] = useState<number>(1); // store number of nights calculated from selected date range
    const [totalPrice, setTotalPrice] = useState<number>(0); // store total reservation price including nights and fees
    const [dateRange, setDateRange] = useState<Range>(initialDateRange); // store currently selected check-in and check-out dates
    const [bookedDates, setBookedDates] = useState<Date[]>([]); // store dates that are already booked to disable them in the calendar
    const [guests, setGuests] = useState<string>('1'); // store selected number of guests as string for form compatibility
    
    const guestsRange = Array.from({ length: property.guests }, (_, index) => index + 1); // generate selectable guest count options based on property capacity

    const performBooking = async () => { // define an async function to submit a booking request for the selected property
        console.log('performBooking', userId); // log booking attempt along with user id for debugging
    
        if (userId) { // ensure the user is authenticated before allowing booking
            if (dateRange.startDate && dateRange.endDate) { // ensure both start and end dates are selected
                const formData = new FormData(); // create FormData object to send booking payload as multipart form data
                
                formData.append('guests', guests); // attach selected number of guests to booking request
                formData.append('start_date', format(dateRange.startDate, 'yyyy-MM-dd')); // attach formatted check-in date
                formData.append('end_date', format(dateRange.endDate, 'yyyy-MM-dd')); // attach formatted check-out date
                formData.append('number_of_nights', nights.toString()); // attach calculated number of nights as string
                formData.append('total_price', totalPrice.toString()); // attach computed total booking price
    
                const response = await apiService.post(`/api/properties/${property.id}/book/`, formData); // send booking request to backend for the given property
    
                if (response.success) { // check if backend confirms successful booking
                    console.log('Bookin successful'); // log success confirmation for debugging
                } else {
                    console.log('Something went wrong...'); // log failure when booking request is rejected or fails
                }
            }
        } else {
            loginModal.open(); // prompt login modal when unauthenticated user attempts to book
        }
    }
    
    const _setDateRange = (selection: any) => { // define helper function to normalize and update selected date range
        const newStartDate = new Date(selection.startDate); // convert selected start date into Date object
        
        const newEndDate = new Date(selection.endDate); // convert selected end date into Date object
    
        if (newEndDate <= newStartDate) { // ensure end date is always after start date
            newEndDate.setDate(newStartDate.getDate() + 1); // force minimum stay of one night by adjusting end date
        }
    
        setDateRange({ // update date range state with validated dates
            ...dateRange,
            startDate: newStartDate,
            endDate: newEndDate
        })
    }
    
    const getReservations = async () => { // define async function to fetch existing reservations for the property
        const reservations = await apiService.get(`/api/properties/${property.id}/reservations/`); // request reservation data from backend
    
        let dates: Date[] = []; // initialize array to accumulate all booked dates
    
        reservations.forEach((reservation: any) => { // iterate through each reservation record
            const range = eachDayOfInterval({ // generate list of dates covered by the reservation
                start: new Date(reservation.start_date),
                end: new Date(reservation.end_date)
            });
    
            dates = [...dates, ...range]; // merge reservation dates into the booked dates array
        })
    
        setBookedDates(dates); // update state to disable booked dates in the calendar
    }    

    useEffect(() => { // run side effect to refresh reservations and pricing
        getReservations(); // fetch existing reservations to update disabled dates in the calendar
        
        if (dateRange.startDate && dateRange.endDate) { // ensure both start and end dates are available before calculating pricing
            const dayCount = differenceInDays( // calculate total number of nights between selected dates
                dateRange.endDate, // provide check-out date as the end boundary for calculation
                dateRange.startDate // provide check-in date as the start boundary for calculation
            );
    
            if (dayCount && property.price_per_night) { // handle case where stay spans multiple nights and price is defined
                const _fee = ((dayCount * property.price_per_night) / 100) * 5; // calculate 5% service fee based on total stay cost
                setFee(_fee); // store calculated service fee in state
                setTotalPrice((dayCount * property.price_per_night) + _fee); // store total price including nights and service fee
                setNights(dayCount); // store calculated number of nights for display and booking payload
            } else {
                const _fee = (property.price_per_night / 100) * 5; // calculate 5% service fee for a single-night stay
                setFee(_fee); // store single-night service fee in state
                setTotalPrice(property.price_per_night + _fee); // store total price for one night including fee
                setNights(1); // default nights to one when dates are the same or calculation yields zero
            }
        }
    }, [dateRange]); // re-run effect whenever date range selection changes    

    return (
        <aside className="mt-6 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
            <h2 className="mb-5 text-2xl">${property.price_per_night} per night {/* display dynamic nightly price of the selected property */}</h2>
            <DatePicker
                value={dateRange} // pass currently selected date range to keep calendar state in sync
                bookedDates={bookedDates} // pass already booked dates to disable unavailable days
                onChange={(value) => _setDateRange(value.selection)} // handle calendar changes and normalize selected date range
            />
    
            <div className="mb-6 p-3 border border-gray-400 rounded-xl">
                <label className="mb-2 block font-bold text-xs">Guests</label>
    
                <select 
                    value={guests} // bind selected guest count to component state
                    onChange={(e) => setGuests(e.target.value)} // update guest count state when user selects a new value
                    className="w-full -ml-1 text-xm"
                >
                    {guestsRange.map(number => ( // dynamically render guest options based on property capacity
                        <option key={number} value={number}>{number}</option>
                    ))}
                </select>
            </div>
    
            <div 
                onClick={performBooking} // trigger booking flow when user clicks the book button
                className="w-full mb-6 py-6 text-center text-white bg-airbnb hover:bg-airbnb-dark rounded-xl"
            >
                Book
            </div>
    
            <div className="mb-4 flex justify-between align-center">
                <p>${property.price_per_night} * {nights} nights {/* show pricing breakdown using dynamic nights count */}</p>
                <p>${property.price_per_night * nights} {/* display subtotal price before fees */}</p>
            </div>
    
            <div className="mb-4 flex justify-between align-center">
                <p>Djangobnb fee</p>
                <p>${fee} {/* display calculated service fee */}</p>
            </div>
    
            <hr />
    
            <div className="mt-4 flex justify-between align-center font-bold">
                <p>Total</p>
                <p>${totalPrice} {/* display final total price including fees */}</p>
            </div>
        </aside>
    )    
}

export default ReservationSidebar;