import { VStack, Flex, Input, Button, Textarea, Heading, FormLabel, FormControl } from "@chakra-ui/react"; // import Chakra UI components for layout, inputs, buttons, textarea, and form labels
import { useState } from "react"; // import useState hook to manage form state
import { update_user, logout } from "../api/endpoints"; // import API functions to update user info and logout
import { useNavigate } from "react-router-dom"; // import hook to navigate programmatically

const Settings = () => { // define a functional component for user settings page
    const storage = JSON.parse(localStorage.getItem('userData')) // get stored user data from localStorage

    const [username, setUsername] = useState(storage ? storage.username : '') // state for username input, initialized from localStorage
    const [email, setEmail] = useState(storage ? storage.email : '') // state for email input, initialized from localStorage
    const [firstName, setFirstName] = useState(storage ? storage.first_name : '') // state for first name input, initialized from localStorage
    const [lastName, setLastName] = useState(storage ? storage.last_name : '') // state for last name input, initialized from localStorage
    const [bio, setBio] = useState(storage ? storage.bio : '') // state for bio input, initialized from localStorage
    const [profileImage, setProfileImage] = useState(storage ? storage.profile_image : '') // state for profile image input, initialized from localStorage

    const nav = useNavigate(); // get navigate function to redirect user

    const handleLogout = async () => { // define function to handle logout
        try {
            await logout(); // call API to logout user
            nav('/login') // navigate to login page after successful logout
        } catch { // handle logout error
            alert('error logging out') // show error alert
        }
    }

    const handleUpdate = async () => { // define function to handle updating user details
        try {
            await update_user({ 
                "username": username, 
                "profile_image": profileImage, 
                "email": email, 
                "first_name": firstName, 
                "last_name": lastName, 
                "bio": bio 
            }) // call API to update user details with current state
            localStorage.setItem("userData", JSON.stringify({ 
                "username": username, 
                "email": email, 
                "first_name": firstName, 
                "last_name": lastName, 
                "bio": bio 
            })) // update localStorage with new user data
            alert('successfully updated') // show success alert
        } catch { // handle update error
            alert('error updating details') // show error alert
        }
    }

    return ( // return JSX for settings page layout
        <Flex w='100%' justifyContent='center' pt='50px'> {/* flex container to center content horizontally */}
            <VStack w='95%' maxW='500px' alignItems='start' gap='20px'> {/* vertical stack for form fields and buttons */}
                <Heading>Settings</Heading> {/* heading for settings page */}
                <VStack w='100%' alignItems='start' gap='10px'> {/* vertical stack for input fields */}
                    <FormControl> {/* form control for profile image */}
                        <FormLabel>Profile Picture</FormLabel> {/* label for profile picture */}
                        <input onChange={(e) => setProfileImage(e.target.files[0])} bg='white' type='file' /> {/* file input updates profileImage state */}
                    </FormControl>
                    <FormControl> {/* form control for username */}
                        <FormLabel>Username</FormLabel> {/* label for username input */}
                        <Input onChange={(e) => setUsername(e.target.value)} value={username} bg='white' type='text' /> {/* input updates username state */}
                    </FormControl>
                    <FormControl> {/* form control for email */}
                        <FormLabel>Email</FormLabel> {/* label for email input */}
                        <Input onChange={(e) => setEmail(e.target.value)} value={email} bg='white' type='email' /> {/* input updates email state */}
                    </FormControl>
                    <FormControl> {/* form control for first name */}
                        <FormLabel>First Name</FormLabel> {/* label for first name input */}
                        <Input onChange={(e) => setFirstName(e.target.value)} value={firstName} bg='white' type='text' /> {/* input updates firstName state */}
                    </FormControl>
                    <FormControl> {/* form control for last name */}
                        <FormLabel>Last Name</FormLabel> {/* label for last name input */}
                        <Input onChange={(e) => setLastName(e.target.value)} value={lastName} bg='white' type='text' /> {/* input updates lastName state */}
                    </FormControl>
                    <FormControl> {/* form control for bio */}
                        <FormLabel>Bio</FormLabel> {/* label for bio input */}
                        <Textarea onChange={(e) => setBio(e.target.value)} value={bio} bg='white' type='text' /> {/* textarea updates bio state */}
                    </FormControl>
                    <Button onClick={handleUpdate} w='100%' colorScheme="blue" mt='10px'>Save changes</Button> {/* button triggers handleUpdate to save changes */}
                </VStack>
                <Button onClick={handleLogout} colorScheme="red">Logout</Button> {/* button triggers handleLogout to log out user */}
            </VStack>
        </Flex>
    )
}

export default Settings; // export Settings component for use in routes/pages
