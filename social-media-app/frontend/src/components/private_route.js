import { useAuth } from "../contexts/useAuth"; // import custom hook to access authentication context
import { Navigate } from "react-router-dom"; // import Navigate component to redirect users programmatically
import { Text } from "@chakra-ui/react"; // import Text component from Chakra UI for displaying loading message

const PrivateRoute = ({ children }) => { // define a functional component to protect routes, accepts children components
    const { auth, authLoading } = useAuth(); // get auth state and loading status from context

    if (authLoading) { // check if authentication status is still loading
        return <Text>Loading...</Text> // show loading message while auth check completes
    }

    if (auth) { // check if user is authenticated
        return children // render protected children components if authenticated
    } else { // if user is not authenticated
        return <Navigate to='/login' /> // redirect user to login page
    }
}

export default PrivateRoute; // export PrivateRoute component for use in route protection
