import React, { useEffect, useState } from 'react'; // import 'useState' and 'useEffect' hooks from react library and React also

// create a functional component 'UserBookings' that takes in props called 'token' and 'userId'
const UserBookings = ({ token, userId }) => {
  const [bookings, setBookings] = useState([]); // create a state variable 'bookings' that holds an empty array initially and function 'setBookings' to update it
  const [loading, setLoading] = useState(true); // create a state variable 'loading' that holds a true boolean value initially and function 'setLoading' to update it
  const [error, setError] = useState(null); // create a state variable 'error' that holds a null value initially and function 'setError' to update it

  useEffect(() => {
    if (!token || !userId) return; // this side effect will not run of 'token' and/or 'userId' is not available

    // fetch bookings from the API with 'token' for authorization
    fetch(`http://localhost:8000/api/user/${userId}/bookings/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      // if response data is not ok ie no data is returned, throw an error, otherwise return the response data as JSON
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        return res.json();
      })
      // if data was received, log it to console, and update 'bookings' state variable with the data and set 'loading' to false as we got/didn't get data
      .then((data) => {
        console.log('Bookings Data:', data);
        setBookings(data);
        setLoading(false);
      })
      // if an error occurred, log it to console, update 'error' state variable with the error message and set 'loading' to false as we got/didn't get data
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [token, userId]); // this effect will run only when 'token' or 'userId' changes

  // render these things if 'loading' and/or 'error' exists
  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p> // render this part if 'bookings' array is empty
      ) : (
        <ul className="space-y-4">
          {/* for each item in 'bookings' array, render the following things */}
          {bookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded shadow">
              <p>
                <strong>Bus:</strong>{' '}
                {booking.bus
                  ? `${booking.bus.bus_name} (${booking.bus.number})`
                  : 'N/A'}
              </p>
              <p><strong>Origin:</strong> {booking.origin || 'N/A'}</p>
              <p><strong>Destination:</strong> {booking.destination || 'N/A'}</p>
              <p><strong>Price:</strong> ₹{booking.price || 'N/A'}</p>
              <p><strong>Seat Number:</strong> {booking.seat ? booking.seat.seat_number : 'N/A'}</p>
              <p><strong>Booked At:</strong> {new Date(booking.booking_time).toLocaleString()}</p>

              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => console.log(`Proceeding to payment for booking ${booking.id}`)}
              >
                Proceed to Payment
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookings;