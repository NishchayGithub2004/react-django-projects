import { createContext, useContext, useState, useEffect } from 'react' // import React hooks for state, context, and effects
import { get_auth, login } from '../api/endpoints'; // import API functions to check auth status and log in
import { useNavigate } from 'react-router-dom'; // import useNavigate hook to programmatically navigate

const AuthContext = createContext(); // create a new context to hold authentication state

export const AuthProvider = ({ children }) => { // define a function component to provide auth context to children
    const [auth, setAuth] = useState(false) // create state to track if user is authenticated
    const [authLoading, setAuthLoading] = useState(true) // create state to track if auth check is in progress
    const navigate = useNavigate(); // get navigate function to redirect users programmatically

    const check_auth = async () => { // define a function to check if user is authenticated
        try {
            await get_auth(); // call get_auth API to verify authentication status
            setAuth(true) // set auth state to true if authenticated
        } catch { // if API call fails (unauthenticated)
            setAuth(false) // set auth state to false
        } finally {
            setAuthLoading(false) // set auth loading to false after check completes
        }
    }

    const auth_login = async (username, password) => { // define a function to log in user with username and password
        const data = await login(username, password) // call login API with provided credentials
        
        if (data.success) { // if login is successful
            setAuth(true) // update auth state to true
            
            const userData = { // create an object to store user details
                "username": data.user.username, // store username
                "bio": data.user.bio, // store bio
                "email": data.user.email, // store email
                "first_name": data.user.first_name, // store first name
                "last_name": data.user.last_name, // store last name
            }
            
            localStorage.setItem('userData', JSON.stringify(userData)) // save user data in local storage
            
            navigate(`/${username}`) // redirect user to their profile page
        } else { // if login fails
            alert('invalid username or password') // show alert for invalid credentials
        }
    }

    useEffect(() => { // run effect when component mounts or pathname changes
        check_auth() // call check_auth function to verify authentication status
    }, [window.location.pathname]) // dependency array to trigger effect on pathname change

    return (
        <AuthContext.Provider value={{ auth, authLoading, auth_login }}> {/* provide auth state and login function to children */}
            {children} 
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext); // define a function to consume AuthContext in child components
