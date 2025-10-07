import { VStack, Flex, FormControl, Input, Button, FormLabel, Heading, Text } from "@chakra-ui/react"; // import Chakra UI components for layout, form, buttons, and text
import { register } from "../api/endpoints"; // import API function to register a new user
import { useState } from "react"; // import useState hook to manage form state
import { useNavigate } from "react-router-dom"; // import hook to navigate programmatically

const Register = () => { // define a functional component for the registration page
    const [username, setUsername] = useState('') // state to store username input
    const [email, setEmail] = useState('') // state to store email input
    const [firstName, setFirstName] = useState('') // state to store first name input
    const [lastName, setLastName] = useState('') // state to store last name input
    const [password, setPassword] = useState('') // state to store password input
    const [confirmPassword, setConfirmPassword] = useState('') // state to store confirm password input
    
    const navigate = useNavigate(); // get navigate function to redirect user after registration

    const handleRegister = async () => { // define a function to handle registration
        if (password === confirmPassword) { // check if password and confirm password match
            try {
                await register(username, email, firstName, lastName, password); // call register API with form data
                alert('successful registration') // show success alert
                navigate('/login') // navigate user to login page
            } catch { // handle registration error
                alert('error registering') // show error alert
            }
        } else { // if passwords do not match
            alert('password and confirm password are not identical') // show mismatch alert
        }
    }

    const handleNav = () => { // define function to navigate to login page
        navigate('/login') // navigate to '/login'
    }

    return ( // return JSX for registration form
        <Flex w='100%' h='calc(100vh - 90px)' justifyContent='center' alignItems='center'> {/* flex container to center form vertically and horizontally */}
            <VStack alignItems='start' w='95%' maxW='400px' gap='20px'> {/* vertical stack for form with spacing */}
                <Heading>Register</Heading> {/* heading for registration form */}
                <FormControl> {/* form control wrapper for username */}
                    <FormLabel htmlFor='username'>Username</FormLabel> {/* label for username input */}
                    <Input onChange={(e) => setUsername(e.target.value)} bg='white' type='text' /> {/* input field updates username state */}
                </FormControl>
                <FormControl> {/* form control wrapper for email */}
                    <FormLabel htmlFor='username'>Email</FormLabel> {/* label for email input */}
                    <Input onChange={(e) => setEmail(e.target.value)} bg='white' type='email' /> {/* input field updates email state */}
                </FormControl>
                <FormControl> {/* form control wrapper for first name */}
                    <FormLabel htmlFor='username'>First Name</FormLabel> {/* label for first name input */}
                    <Input onChange={(e) => setFirstName(e.target.value)} bg='white' type='text' /> {/* input field updates first name state */}
                </FormControl>
                <FormControl> {/* form control wrapper for last name */}
                    <FormLabel htmlFor='username'>Last Name</FormLabel> {/* label for last name input */}
                    <Input onChange={(e) => setLastName(e.target.value)} bg='white' type='text' /> {/* input field updates last name state */}
                </FormControl>
                <FormControl> {/* form control wrapper for password */}
                    <FormLabel htmlFor='password'>Password</FormLabel> {/* label for password input */}
                    <Input onChange={(e) => setPassword(e.target.value)} bg='white' type='password' /> {/* input field updates password state */}
                </FormControl>
                <FormControl> {/* form control wrapper for confirm password */}
                    <FormLabel htmlFor='password'>Confirm Password</FormLabel> {/* label for confirm password input */}
                    <Input onChange={(e) => setConfirmPassword(e.target.value)} bg='white' type='password' /> {/* input field updates confirm password state */}
                </FormControl>
                <VStack w='100%' alignItems='start' gap='10px'> {/* vertical stack for register button and navigation text */}
                    <Button onClick={handleRegister} w='100%' colorScheme="green" fontSize='18px'>Register</Button> {/* register button triggers handleRegister */}
                    <Text onClick={handleNav} fontSize='14px' color='gray.500'>Already have an account? Log in</Text> {/* text acting as link to login page */}
                </VStack>
            </VStack>
        </Flex>
    )
}

export default Register; // export Register component for use in routes/pages
