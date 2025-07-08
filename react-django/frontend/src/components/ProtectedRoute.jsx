import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // import 'jwtDecode' function from 'jwt-decode' library to decode JWT tokens
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react"; // import 'useState' and 'useEffect' hooks from 'react' library

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null); // initialize 'isAuthorized' state variable with 'null' value with 'setIsAuthorized' function to update its value

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, []) // call 'auth' function with 'useEffect' hook to check if user is authorized as soon as component mounts

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN); // get refresh token from local storage
        
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            }); // send POST request to '/api/token/refresh/' endpoint with refresh token in request body
            // if 'res' status is 200, update access token in local storage to value of response data's 'access' token and set 'isAuthorized' state variable to 'true' as user is authorized
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false) // otherwise, set 'isAuthorized' state variable to 'false' as user was not authorized
            }
        } 
        
        // if there's an error, log it to console and set 'isAuthorized' state variable to 'false' as user was not authorized
        catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    // create an async 'auth' function to check if user is authorized
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN); // get access token from local storage
        
        // if there's no token, set 'isAuthorized' state variable to 'false' and return as user was not authorized
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        
        const decoded = jwtDecode(token); // decode JWT token
        const tokenExpiration = decoded.exp; // get token expiration time
        const now = Date.now() / 1000; // get current time in seconds

        // if token has expired, refresh it, otherwise set 'isAuthorized' state variable to 'true' as user is authorized successfully
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    // if 'isAuthorized' state variable is 'null', return 'Loading...' message
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />; // if 'isAuthorized' state variable is 'true', return 'children' prop, otherwise return 'Navigate' component to redirect user to '/login' page
}

export default ProtectedRoute;