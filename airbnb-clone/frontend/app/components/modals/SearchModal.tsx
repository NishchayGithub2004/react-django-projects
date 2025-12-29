'use client';

import Modal from "./Modal"; // import Modal to display the search flow inside a reusable modal container
import { useState } from "react"; // import useState to manage local component state
import { Range } from "react-date-range"; // import Range to type the date range object used by the date picker
import DatePicker from "../forms/Calendar"; // import DatePicker to allow users to select check-in and check-out dates
import CustomButton from "../forms/CustomButton"; // import CustomButton to navigate between search steps
import useSearchModal, { SearchQuery } from "@/app/hooks/useSearchModal"; // import search modal hook and SearchQuery type to manage search flow and query state
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry"; // import SelectCountry to choose destination and its value type

const initialDateRange = { // define a default date range object to initialize calendar selection
    startDate: new Date(), // set default check-in date to today
    endDate: new Date(), // set default check-out date to today
    key: 'selection' // define key required by react-date-range to track selection
}

const SearchModal = () => { // define a functional component named 'SearchModal' to handle multi-step property search
    let content = (<></>); // initialize a placeholder JSX variable to dynamically assign modal content
    
    const searchModal = useSearchModal(); // initialize search modal controller to manage steps and visibility
    
    const [numGuests, setNumGuests] = useState<string>('1'); // store number of guests selected by the user
    const [numBedrooms, setNumBedrooms] = useState<string>('0'); // store number of bedrooms selected by the user
    const [country, setCountry] = useState<SelectCountryValue>(); // store selected country value for search location
    const [numBathrooms, setNumBathrooms] = useState<string>('0'); // store number of bathrooms selected by the user
    const [dateRange, setDateRange] = useState<Range>(initialDateRange); // store selected check-in and check-out dates

    const closeAndSearch = () => { // define a function to finalize search criteria and close the modal
        const newSearchQuery: SearchQuery = { // construct a strongly typed search query object
            country: country?.label, // assign selected country label if available
            checkIn: dateRange.startDate, // assign selected check-in date
            checkOut: dateRange.endDate, // assign selected check-out date
            guests: parseInt(numGuests), // convert guest count string to number
            bedrooms: parseInt(numBedrooms), // convert bedroom count string to number
            bathrooms: parseInt(numBathrooms), // convert bathroom count string to number
            category: '' // assign empty category placeholder for future filtering
        }

        searchModal.setQuery(newSearchQuery); // persist search query into global search modal state

        searchModal.close(); // close the search modal after applying filters
    }

    const _setDateRange = (selection: Range) => { // define a helper function to update date range and advance steps
        if (searchModal.step === 'checkin') { // check if user is currently selecting check-in date
            searchModal.open('checkout'); // automatically advance to check-out step
        } else if (searchModal.step === 'checkout') { // check if user is currently selecting check-out date
            searchModal.open('details'); // automatically advance to details step
        }

        setDateRange(selection); // update local date range state with new selection
    }

    const contentLocation = ( // define JSX content for the location selection step
        <>
            <h2 className="mb-6 text-2xl">Where do you want to go?</h2>

            <SelectCountry
                value={country} // pass currently selected country value
                onChange={(value) => setCountry(value as SelectCountryValue)} // update country state when user selects a location
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="Check in date ->"
                    onClick={() => searchModal.open('checkin')} // navigate to check-in date selection step
                />
            </div>
        </>
    )

    const contentCheckin = ( // define JSX content for the check-in date selection step
        <>
            <h2 className="mb-6 text-2xl">When do you want to check in?</h2>

            <DatePicker
                value={dateRange} // provide current date range selection to the calendar
                onChange={(value) => _setDateRange(value.selection)} // update date range and advance flow on selection
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="<- Location"
                    onClick={() => searchModal.open('location')} // navigate back to location selection step
                />

                <CustomButton
                    label="Check out date ->"
                    onClick={() => searchModal.open('checkout')} // navigate to check-out date selection step
                />
            </div>
        </>
    )

    const contentCheckout = ( // define JSX content for the check-out date selection step
        <>
            <h2 className="mb-6 text-2xl">When do you want to check out?</h2>

            <DatePicker
                value={dateRange} // provide current date range selection to the calendar
                onChange={(value) => _setDateRange(value.selection)} // update date range and advance flow on selection
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="<- Check in date"
                    onClick={() => searchModal.open('checkin')} // navigate back to check-in date selection step
                />

                <CustomButton
                    label="Details ->"
                    onClick={() => searchModal.open('details')} // navigate to guest and room details step
                />
            </div>
        </>
    )

    const contentDetails = ( // define JSX content for the final step where user specifies guest and room details
        <>
            <h2 className="mb-6 text-2xl">Details</h2>

            <div className="space-y-4">
                <div className="space-y-4">
                    <label>Number of guests:</label>
                    <input
                        type="number"
                        min="1"
                        value={numGuests} // bind guest count input to numGuests state
                        placeholder="Number of guests..."
                        onChange={(e) => setNumGuests(e.target.value)} // update guest count state on user input
                        className="w-full h-14 px-4 border border-gray-300 rounded-xl"
                    />
                </div>

                <div className="space-y-4">
                    <label>Number of bedrooms:</label>
                    <input
                        type="number"
                        min="1"
                        value={numBedrooms} // bind bedroom count input to numBedrooms state
                        placeholder="Number of bedrooms..."
                        onChange={(e) => setNumBedrooms(e.target.value)} // update bedroom count state on user input
                        className="w-full h-14 px-4 border border-gray-300 rounded-xl"
                    />
                </div>

                <div className="space-y-4">
                    <label>Number of bathrooms:</label>
                    <input
                        type="number"
                        min="1"
                        value={numBathrooms} // bind bathroom count input to numBathrooms state
                        placeholder="Number of bathrooms..."
                        onChange={(e) => setNumBathrooms(e.target.value)} // update bathroom count state on user input
                        className="w-full h-14 px-4 border border-gray-300 rounded-xl"
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="<- Check out date"
                    onClick={() => searchModal.open('checkout')} // navigate back to checkout date selection step
                />

                <CustomButton
                    label="Search"
                    onClick={closeAndSearch} // finalize search query and close the search modal
                />
            </div>
        </>
    )

    if (searchModal.step == 'location') { // check if current modal step is location selection
        content = contentLocation; // assign location selection content to modal
    } else if (searchModal.step == 'checkin') { // check if current modal step is check-in date selection
        content = contentCheckin; // assign check-in content to modal
    } else if (searchModal.step == 'checkout') { // check if current modal step is check-out date selection
        content = contentCheckout; // assign check-out content to modal
    } else if (searchModal.step == 'details') { // check if current modal step is guest and room details
        content = contentDetails; // assign details content to modal
    }

    return (
        <Modal
            label="Search"
            content={content}
            close={searchModal.close}
            isOpen={searchModal.isOpen}
        />
    )
}

export default SearchModal;