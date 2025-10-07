import { VStack, Flex, Heading, FormControl, FormLabel, Input, Button } from "@chakra-ui/react"; // import Chakra UI components for layout, form, and buttons
import { create_post } from "../api/endpoints"; // import API function to create a new post
import { useState } from "react"; // import useState hook to manage component state
import { useNavigate } from "react-router-dom"; // import hook to navigate programmatically

const CreatePost = () => { // define a functional component for creating a new post
    const [description, setDescription] = useState('') // state to store post description entered by user
    
    const nav = useNavigate() // get navigate function to redirect user after post creation

    const handlePost = async () => { // define a function to handle post creation
        try {
            await create_post(description) // call API to create a new post with current description
            nav('/') // navigate user to home page after successful post creation
        } catch { // if API call fails
            alert('error creating post') // show error alert
        }
    }

    return ( // return JSX for create post form
        <Flex w='100%' h='100%' justifyContent='center' pt='50px'> {/* flex container to center form on page */}
            <VStack w='95%' maxW='450px' alignItems='start' gap='40px'> {/* vertical stack for form with spacing and alignment */}
                <Heading>Create Post</Heading> {/* heading for form */}
                <FormControl> {/* form control wrapper for description input */}
                    <FormLabel>Description</FormLabel> {/* label for description input */}
                    <Input onChange={(e) => setDescription(e.target.value)} bg='white' type='text' /> {/* input field, updates description state on change */}
                </FormControl>
                <Button onClick={handlePost} w='100%' colorScheme="blue">Create Post</Button> {/* button to submit post, calls handlePost on click */}
            </VStack>
        </Flex>
    )
}

export default CreatePost; // export CreatePost component for use in routes or pages
