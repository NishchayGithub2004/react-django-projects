import { VStack, Flex, FormControl, Input, Button, FormLabel, Heading, Text } from "@chakra-ui/react"; // import Chakra UI components for layout, form, buttons, and text
import { useState } from "react"; // import useState hook to manage input state
import { useNavigate } from "react-router-dom"; // import hook to navigate programmatically
import { useAuth } from "../contexts/useAuth"; // import custom hook to access authentication context

const Login = () => { // define a functional component for the login page
    const [username, setUsername] = useState('') // state to store username input
    const [password, setPassword] = useState('') // state to store password input
    
    const navigate = useNavigate(); // get navigate function to redirect users
    const { auth_login } = useAuth(); // get login function from auth context

    const handleLogin = () => { // define function to handle login button click
        auth_login(username, password) // call auth_login with current username and password
    }

    const handleNav = () => { // define function to navigate to registration page
        navigate('/register') // navigate to '/register'
    }

    return ( // return JSX for login form layout
        <Flex w='100%' h='calc(100vh - 90px)' justifyContent='center' alignItems='center'> {/* flex container to center form vertically and horizontally */}
            <VStack alignItems='start' w='95%' maxW='400px' gap='30px'> {/* vertical stack for form inputs and buttons */}
                <Heading>Login</Heading> {/* heading for login form */}
                <FormControl> {/* form control wrapper for username */}
                    <FormLabel htmlFor='username'>Username</FormLabel> {/* label for username input */}
                    <Input onChange={(e) => setUsername(e.target.value)} bg='white' type='text' /> {/* input field to update username state on change */}
                </FormControl>
                <FormControl> {/* form control wrapper for password */}
                    <FormLabel htmlFor='password'>Password</FormLabel> {/* label for password input */}
                    <Input onChange={(e) => setPassword(e.target.value)} bg='white' type='password' /> {/* input field to update password state on change */}
                </FormControl>
                <VStack w='100%' alignItems='start'> {/* vertical stack for buttons and additional text */}
                    <Button onClick={handleLogin} w='100%' colorScheme="green" fontSize='18px'>Login</Button> {/* login button, triggers handleLogin */}
                    <Text onClick={handleNav} fontSize='14px' color='gray.500'>Don't have an account? Sign up</Text> {/* text acting as link to registration page */}
                </VStack>
            </VStack>
        </Flex>
    )
}

export default Login; // export Login component for use in routes/pages
