import React, {useState, useEffect} from 'react' // import 'useState' and 'useEffect' hooks from react library and React also
import axios from 'axios' // import axios library to make api calls
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from react-router-dom library to navigate between routes

const BusList = () => {
  const [buses, setBuses] = useState([]) // initialize 'buses' state variable with an empty array and a function 'setBuses' to update it using 'useState' hook

  const navigate = useNavigate() // initialize 'navigate' function using 'useNavigate' hook to navigate between routes

  // create a useEffect hook to fetch buses data from the server when the component mounts
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/buses/") // make a GET request to the server to fetch buses data
        setBuses(response.data) // update 'buses' state variable with the fetched buses data
      } catch (error) {
        console.log('error in fetching buses', error) // log any error that occur during the fetching process
      }
    }
    fetchBuses() // call the 'fetchBuses' function as soon as the component mounts and function loads
  }, [])

  // create a function 'handleViewSeats' that takes 'id' as argument and navigates to '/bus/id' route
  const handleViewSeats = (id) => {
    navigate(`/bus/${id}`)
  }

  return (
    <div>
      {/* iterate over 'buses' array and render the following contents for each item in the array */}
      {buses.map((item) => {
        return (
          <div key={item.id}>
            <div>Bus name{item.bus_name}</div>
            <div>Bus number{item.number}</div>
            <div>Origin{item.origin}</div>
            <div>Destination{item.destination}</div>
            <div>Start Time{item.start_time}</div>
            <div>Reach Time{item.reach_time}</div>
            <button onClick={() => handleViewSeats(item.id)}>View Seats</button>
            <hr />
          </div>
        )
      })}
    </div>
  )
}

export default BusList;