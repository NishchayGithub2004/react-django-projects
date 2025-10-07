import { VStack, Flex, HStack, Input, Button, Box, Image, Heading, Text } from "@chakra-ui/react"; // import Chakra UI components for layout, inputs, buttons, images, and text
import { useState } from "react"; // import useState hook to manage component state
import { SERVER_URL } from "../constants/constants"; // import server URL constant
import { useNavigate } from "react-router-dom"; // import hook to navigate programmatically
import { search_users } from "../api/endpoints"; // import API function to search users

const UserProfile = ({ username, profile_image, first_name, last_name }) => { // define a functional component to display a user's profile summary
    const nav = useNavigate() // get navigate function to redirect to user's profile

    const handleNav = () => { // define function to navigate to user's profile page
        nav(`/${username}`) // navigate to dynamic route for the user
    }

    return ( // return JSX for user profile card
        <Flex onClick={handleNav} w='100%' h='100px' border='1px solid' borderColor='gray.300' borderRadius='8px' bg='white' justifyContent='center' alignItems='center'> {/* clickable flex container for profile card */}
            <HStack w='90%' gap='20px' alignItems='center'> {/* horizontal stack for image and text */}
                <Box boxSize='70px' borderRadius='full' overflow='hidden' bg='white' border='1px solid'> {/* circular container for profile image */}
                    <Image src={`${SERVER_URL}${profile_image}`} boxSize='100%' objectFit='cover'/> {/* display profile image from server */}
                </Box>
                <VStack alignItems='start' gap='3px'> {/* vertical stack for user's name and username */}
                    <Text fontWeight='medium'>{first_name} {last_name}</Text> {/* display full name */}
                    <Text color='gray.600' fontSize='15px'>@{username}</Text> {/* display username */}
                </VStack>
            </HStack>
        </Flex>
    )
}

const Search = () => { // define a functional component for searching users
    const [search, setSearch] = useState('') // state to store current search query
    const [users, setUsers] = useState([]) // state to store search results

    const handleSearch = async () => { // define function to handle search button click
        const users = await search_users(search) // call API to search users based on current query
        setUsers(users) // update state with search results
    }

    return ( // return JSX for search page
        <Flex w='100%' justifyContent='center' pt='50px'> {/* flex container to center content */}
            <VStack w='95%' maxW='500px' alignItems='start' gap='20px'> {/* vertical stack for input, button, and search results */}
                <Heading>Search Users</Heading> {/* heading for search section */}
                <HStack w='100%' gap='0'> {/* horizontal stack for input and search button */}
                    <Input onChange={(e) => setSearch(e.target.value)} bg='white' /> {/* input field updates search state on change */}
                    <Button onClick={handleSearch} colorScheme="blue">Search</Button> {/* button triggers search API call */}
                </HStack>
                <VStack w='100%'> {/* vertical stack to display list of user profiles */}
                    {
                        users.map((user) => { // map through search results
                            return <UserProfile 
                                username={user.username} // pass username
                                profile_image={user.profile_image} // pass profile image
                                first_name={user.first_name} // pass first name
                                last_name={user.last_name} // pass last name
                            />
                        })
                    }
                </VStack>
            </VStack>
        </Flex>
    )
}

export default Search; // export Search component for use in routes/pages
