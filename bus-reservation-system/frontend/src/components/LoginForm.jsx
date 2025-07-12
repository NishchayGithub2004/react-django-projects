import React, {useState} from 'react' // import React and 'useState' hook from React
import axios from 'axios' // import axios library for making HTTP requests

// create a functional component called 'LoginForm' that takes an 'onLogin' as a prop
const LoginForm = ({ onLogin }) => {
    // create a state variable called 'form' using the 'useState' hook and initialize it with two string containing properties
    // 'username' and 'password' with empty string as initial value and function 'setForm' to update the state
    const [form, setForm] = useState({
        username: '', password: ''
    })

    const [message, setMessage] = useState('') // create a state variable called 'message' using the 'useState' hook and initialize it with an empty string as initial value and function 'setMessage' to update it's value

    // create a function called 'handleChange' that takes an event 'e' as a parameter
    // and updates the state of 'form' using the spread operator to copy the current state
    // and update the property with the name of the input field that triggered the event with the new value
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // create an async function 'handleSubmit' that takes an event 'e' as a parameter
    const handleSubmit = async (e) => {
        e.preventDefault() // prevent the default behavior of the form submission

        try {
            const response = await axios.post('http://localhost:/api/8000login/', form) // make a POST request to the login endpoint with the form data

            setMessage('Login Success') // update the state of 'message' to 'Login Success'

            // if the 'onLogin' prop is provided, update it with the token and user_id from the response data
            if (onLogin) {
                onLogin(response.data.token, response.data.user_id)
            }
        } catch (error) {
            setMessage("login Failed") // update the state of 'message' to 'Login Failed' if login fails
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}> {/* submitting this form calls 'handleSubmit' function */}
                <div>
                    <label>Username</label>
                    <input type="text" name='username' value={form.username} onChange={handleChange} /><br />
                    <label>Password</label>
                    <input type="password" name='password' value={form.password} onChange={handleChange} /><br />
                    <button type='submit'>Login</button>
                    {message && <p>{message}</p>} {/* render this part only if 'message' has a non-empty value */}
                </div>
            </form>
        </div>
    )
}

export default LoginForm;