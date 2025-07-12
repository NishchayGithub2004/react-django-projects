import axios from 'axios' // import axios library for making API requests
import React, {useState, useEffect} from 'react' // import useState and useEffect hooks from react and React also
import { useParams, useNavigate } from 'react-router-dom' // import useParams and useNavigate hooks from react-router-dom to use URL parameters and navigate b/w pages

// create a functional component 'BusSeats' that takes 'token' as a prop
const BusSeats = ({token}) => {
    const [bus, setBus] = useState(null) // create a varianle 'bus' and set its initial value to null and function 'setBus' to update it's value
    const [seats, setSeats] = useState([]) // create a variable 'seats' and set its initial value to an empty array and function 'setSeats' to update it's value

    const { busId } = useParams() // extract the 'busId' parameter from the URL
    const navigate = useNavigate() // create a function 'navigate' to navigate b/w pages

    console.log('Checking bus id number=', busId)

    // create an effect using useEffect hook
    useEffect(()=>{
        // create an async function 'fetchBusDetails' to fetch bus details from the API endpoint
        const fetchBusDetails = async()=>{
            try {
                const response = await axios(`http://localhost:8000/api/buses/${busId}`) // make a request to the API endpoint to fetch bus details with given bus ID
                setBus(response.data) // set 'bus' variable to the response data received from the API
                setSeats(response.data.seats || []) // set 'seats' variable to 'seats' array of response data received from the API or empty array if nothing waws fetched
            } catch (error) {
                console.log('Error in fetching details', error) // log the error to the console if any
            }
        }
        fetchBusDetails() // run the function as soon as it's loaded
    }, [busId]) // this side effect acts every time value of 'busId' changes

    // create an async function 'handleBook' that takes 'seatId' as argument
    const handleBook = async(seatId)=>{
        // if 'token' is not present then alert user to login first and navigate to login page
        if (!token) {
            alert("Please login for booking a seat")
            navigate('/login')
            return;
        }
        
        try {
            // make a POST request to the API endpoint to book a seat with given 'seatId' and token works as authorization to access the API resource
            await axios.post("http://localhost:8000/api/booking/",
                {seat:seatId},
                {
                    headers:{
                        Authorization: `Token ${token}`
                    }
                }
            )
            
            alert("Booking Successful") // give an alert message that booking was successful
            
            // call 'setSeats' function to update the 'seats' array by mapping over each seat and marking the booked seat as booked by marking it's 'is_booked' property to true
            setSeats((prevSeats) =>
                prevSeats.map((seat) =>
                  seat.id === seatId ? { ...seat, is_booked: true } : seat
                )
            );
        } catch (error) {
            alert(error.response?.data?.error || "Booking failed") // give an alert message that booking failed and log the error to the console
        }
    }

  return (
    <div>
        {/* this part is rendered if 'bus' is a valid object */}
        {bus && (
            <div>
                <div>{bus.bus_name}</div>
                <div>{bus.number}</div>
                <div>{bus.origin}</div>
                <div>{bus.destination}</div>
                <div>{bus.start_time}</div>
                <div>{bus.reach_time}</div>
            </div>
        )}
      <div>
        {/* iterate over 'seats' array and for each item, render the following content */}
        {seats.map((seat)=>{ 
            return(
                <div key={seat.id}> {/* 'seat.id' is the unique identifier of current item */}
                    <button onClick={()=>handleBook(seat.id)} // clicking this button calls the 'handleBook' function with 'seat.id' as argument
                    style={{color:seat.is_booked? 'red':'green'}} // color of the button depends on value of 'seat.is_booked' property
                    >
                        Seat Number {seat.seat_number}
                    </button>
                </div>
            )
        })}
      </div>
    </div>
  )
}

export default BusSeats;