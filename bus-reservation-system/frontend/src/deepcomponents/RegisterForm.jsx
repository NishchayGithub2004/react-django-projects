import React, { useState } from 'react' // import 'useState' hook and React from react library
import axios from 'axios' // import axios library to make HTTP requests

const RegisterForm = () => {
    // create a state variable 'form' that holds two variables 'username' and 'password' and initialize them to empty strings and function 'setForm' to update them
    const [form, setForm] = useState({
        username: '', email: '', password: ''
    })
    const [message, setMessage] = useState(''); // create a state variable 'message' that holds an empty string initially and function'setMessage' to update it
    const [isLoading, setIsLoading] = useState(false); // create a state variable 'isLoading' that holds a false boolean value initially and function 'setIsLoading' to update it

    // create a function 'handleChange' that takes in an event 'e' and updates the 'form' state variable with the new values from the input fields using the spread operator '...form' and the 'name' and 'value' properties of the event target to identify the input field and its new value
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // create an async function 'handleSubmit' that takes an event object 'e' as parameter
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent default form submission behavior
        
        setIsLoading(true); // set 'isLoading' state variable to true to indicate that the form is being submitted
        
        try {
            await axios.post('http://localhost:8000/api/register/', form); // create a POST request to the server's register endpoint with the form data
            setMessage('Registration successful! You can now login.') // set 'message' state variable to this message to indicate that the registeration was successful
            setForm({ username: '', email: '', password: '' }) // if login was successful, call the 'setForm' prop function with the token and user_id returned from the server
        }
        
        // if login fails, set 'message' state variable to 'Registeration Failed' followed by the error message returned from the server
        catch (error) {
            setMessage("Registration failed: " + (error.response?.data?.username || error.response?.data?.email || error.message))
        } 
        
        // set 'isLoading' state variable to false to indicate that the form submission is successful/unsuccessful
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={form.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`rounded-md p-4 ${message.includes('successful') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            <p className="text-sm">{message}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </>
                            ) : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm;