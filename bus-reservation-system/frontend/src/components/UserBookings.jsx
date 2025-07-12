import axios from 'axios' // import axios library
import React, { useState, useEffect } from 'react' // import useState and useEffect hooks and React from react library

// create a functional component 'UserBookings' and pass token and userId as props
const UserBookings = ({ token, userId }) => {
    const [bookings, setBookings] = useState([]) // create an empty array 'bookings' and a function 'setBookings' to update the state of the array
    const [bookingError, setBookingError] = useState(null) // create an empty string 'bookingError' and a function 'setBookingError' to update the state of the string

    useEffect(() => {
        // create an async function 'fetchBookings' to fetch the bookings of the user, terminate the function if the token or userId is not present
        const fetchBookings = async () => {
            if (!token || !userId) {
                return
            }
            
            try {
                const response = await axios.get(`http://localhost:8000/api/user/${userId}/bookings/`, // send a GET request to the backend API to fetch the bookings of the user, use 'token' for authorization
                    {
                        headers: {
                            Authorization: `Token ${token}`
                        }
                    }
                )
                console.log("Booking data = ", response.data) // log the data received to the console
                setBookings(response.data) // set 'bookings' state to the data received
                console.log("checking for user bookings =", response.data)
            } 
            
            // if an error occurs, log the error to the console and set 'bookingError' state to the error message received
            catch (error) {
                console.log("fetching details failed", error)
                setBookingError(error.response?.data?.message)
            }
        }
        fetchBookings() // call the 'fetchBookings' function as soon as it is loaded
    }, [userId, token]) // this effect runs when the 'userId' or 'token' changes

    return (
        <div>
            {/* this part is rendered if 'bookingError' exists */}
            {bookingError && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    <strong>Error: </strong>{bookingError}
                </div>
            )}

            {/* this part is rendered if 'bookings' array is empty and 'bookingError' does not exist */}
            {bookings.length === 0 && !bookingError && (
                <div>No bookings found.</div>
            )}

            {/* for each item in 'bookings' array, render the following contents */}
            {bookings.map((item) => {
                return (
                    <div key={item.id}>
                        {item.user} - {item.bus} - {item.seat} - {item.booking_time}
                    </div>
                )
            })}
        </div>
    )
}

export default UserBookings;