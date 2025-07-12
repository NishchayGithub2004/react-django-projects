import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const BusSeats = ({ token }) => {
    const [bus, setBus] = useState(null)
    const [seats, setSeats] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])

    const { busId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBusDetails = async () => {
            try {
                const response = await axios(`http://localhost:8000/api/buses/${busId}`)
                setBus(response.data)
                setSeats(response.data.seats || [])
            } catch (error) {
                console.log('Error in fetching details', error)
                setError('Failed to load bus details. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchBusDetails()
    }, [busId])

    const handleSeatSelect = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId))
        } else {
            setSelectedSeats([...selectedSeats, seatId])
        }
    }

    const handleBook = async () => {
        if (!token) {
            alert('Please login to book seats')
            navigate('/login')
            return
        }

        try {
            await Promise.all(selectedSeats.map(seatId =>
                axios.post('http://localhost:8000/api/booking/', { seat: seatId }, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                })
            ))

            alert('Booking successful!')
            setSeats((prevSeats) =>
                prevSeats.map((seat) =>
                    selectedSeats.includes(seat.id) ? { ...seat, is_booked: true } : seat
                )
            )
            setSelectedSeats([])
        } catch (error) {
            alert(error.response?.data?.error || 'Booking failed. Please try again.')
        }
    }

    const handleCancelBooking = async (seatId) => {
        if (!token) {
            alert('Please login to cancel booking')
            navigate('/login')
            return
        }

        const confirmCancel = window.confirm("Are you sure you want to cancel this booking?")
        if (!confirmCancel) return

        try {
            await axios.delete(`http://localhost:8000/api/booking/${seatId}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })

            alert('Booking cancelled!')
            setSeats((prevSeats) =>
                prevSeats.map((seat) =>
                    seat.id === seatId ? { ...seat, is_booked: false } : seat
                )
            )
        } catch (error) {
            alert(error.response?.data?.error || 'Cancellation failed.')
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 max-w-4xl mx-auto">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {bus && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">{bus.bus_name}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Journey Details</h3>
                                <div className="space-y-2">
                                    <p className="flex items-center text-gray-600">
                                        <span className="font-medium mr-2">Route:</span> {bus.origin} → {bus.destination}
                                    </p>
                                    <p className="flex items-center text-gray-600">
                                        <span className="font-medium mr-2">Departure:</span> {bus.start_time}
                                    </p>
                                    <p className="flex items-center text-gray-600">
                                        <span className="font-medium mr-2">Arrival:</span> {bus.reach_time}
                                    </p>
                                    <p className="flex items-center text-gray-600">
                                        <span className="font-medium mr-2">Bus Number:</span> {bus.number}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Seat Legend</h3>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-green-500 rounded-md mr-2"></div>
                                        <span className="text-sm text-gray-600">Available</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-red-500 rounded-md mr-2"></div>
                                        <span className="text-sm text-gray-600">Booked</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-yellow-500 rounded-md mr-2"></div>
                                        <span className="text-sm text-gray-600">Selected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Select Your Seat</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {seats.map((seat) => {
                            const isSelected = selectedSeats.includes(seat.id)
                            return (
                                <div
                                    key={seat.id}
                                    className={`w-16 h-16 flex justify-center items-center border-2 rounded-md cursor-pointer
                                        ${seat.is_booked ? 'bg-red-500 cursor-pointer' :
                                            isSelected ? 'bg-yellow-500' : 'bg-green-500'}
                                    `}
                                    onClick={() =>
                                        seat.is_booked
                                            ? handleCancelBooking(seat.id)
                                            : handleSeatSelect(seat.id)
                                    }
                                >
                                    <span className="text-white">{seat.seat_number}</span>
                                </div>
                            )
                        })}
                    </div>

                    {selectedSeats.length > 0 && (
                        <div className="mt-6">
                            <button
                                onClick={handleBook}
                                className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                            >
                                Book Selected Seats ({selectedSeats.length})
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BusSeats;