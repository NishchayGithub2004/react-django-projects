import { Text, Flex, HStack } from "@chakra-ui/react"; // import Chakra UI components for layout and text
import { useNavigate } from "react-router-dom"; // import hook to navigate programmatically
import { IoPersonOutline } from "react-icons/io5"; // import user icon
import { IoMdAddCircleOutline } from "react-icons/io"; // import add post icon
import { FaHouse } from "react-icons/fa6"; // import home icon
import { IoSearch } from "react-icons/io5"; // import search icon
import { IoMdSettings } from "react-icons/io"; // import settings icon

const Navbar = () => { // define a functional component for navigation bar
    const nav = useNavigate(); // get navigate function to redirect users programmatically

    const handleNavigate = (route) => { // define a function to navigate to a given route
        nav(`/${route}`) // navigate to the provided route
    }

    const handleNavigateUser = () => { // define a function to navigate to logged-in user's profile
        const username = JSON.parse(localStorage.getItem('userData'))['username'] // retrieve username from localStorage
        nav(`/${username}`) // navigate to user's profile page
        window.location.reload(); // reload page to ensure state updates
    }

    return ( // return JSX for navbar layout
        <Flex w='100vw' h='90px' bg='blue.600' justifyContent='center' alignItems='center'> {/* flex container for navbar with full width, height, background color, and centered content */}
            <HStack w='90%' justifyContent='space-between' color='white'> {/* horizontal stack to space content and set text color */}
                <Text fontSize='24px' fontWeight='bold'>SocialHub</Text> {/* brand/logo text */}
                <HStack gap='20px'> {/* horizontal stack for navigation icons with spacing */}
                    <Text onClick={handleNavigateUser}><IoPersonOutline size='20px' /></Text> {/* icon to navigate to user's profile */}
                    <Text onClick={(route) => handleNavigate('create/post')}><IoMdAddCircleOutline size='22px' /></Text> {/* icon to navigate to create post page */}
                    <Text onClick={(route) => handleNavigate('')}><FaHouse size='20px' /></Text> {/* icon to navigate to home page */}
                    <Text onClick={(route) => handleNavigate('search')}><IoSearch size='20px' /></Text> {/* icon to navigate to search page */}
                    <Text onClick={(route) => handleNavigate('settings')}><IoMdSettings size='20px' /></Text> {/* icon to navigate to settings page */}
                </HStack>
            </HStack>
        </Flex>
    )
}

export default Navbar; // export Navbar component for use in other parts of the app
