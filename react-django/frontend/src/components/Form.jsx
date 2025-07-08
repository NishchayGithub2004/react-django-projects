import { useState } from "react"; // import 'userState' hook to update variables
import api from "../api";
import { useNavigate } from "react-router-dom"; // import 'useNavigate' hook from react-router-dom to navigate to different pages
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

// create a component named 'Form' that takes in 'route' and 'method' as props
function Form({ route, method }) {
    const [username, setUsername] = useState(""); // using 'userState' hook, create a variable 'username' with empty string as initial value and a function 'setUsername' to update the variable
    const [password, setPassword] = useState(""); // using 'userState' hook, create a variable 'password' with empty string as initial value and a function 'setPassword' to update the variable
    const [loading, setLoading] = useState(false); // using 'userState' hook, create a variable 'loading' with false as initial value and a function 'setLoading' to update the variable
    const navigate = useNavigate(); // create an instance of 'useNavigate' hook to navigate to different pages

    const name = method === "login" ? "Login" : "Register"; // create a variable 'name' that holds the value of 'Login' if 'method' is 'login' otherwise 'Register'

    const handleSubmit = async (e) => { // create a function 'handleSubmit' that takes event object 'e' as parameter
        setLoading(true); // set 'loading' to true using 'setLoading' function
        
        e.preventDefault(); // prevent default behavior of form submission

        try {
            const res = await api.post(route, { username, password }) // send a POST request to the specified 'route' with 'username' and 'password' as data to identify where to send the request to
            
            // if value of 'method' is 'login', store the access and refresh tokens in local storage and navigate to home page, otherwise navigate to login page
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } 
        
        // if there is an error, display an alert with the error message
        catch (error) {
            alert(error)
        }

        // finally set 'loading' to false using 'setLoading' function
        finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container"> {/* call 'handleSubmit' function when this form is submitted */}
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // set 'username' to the value given to this input field using 'setUsername' function
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // set 'password' to the value given to this input field using 'setPassword' function
                placeholder="Password"
            />
            {loading && <LoadingIndicator />} {/* this part is rendered only if value of 'loading' is false */}
            <button className="form-button" type="submit">{name}</button>
        </form>
    );
}

export default Form;