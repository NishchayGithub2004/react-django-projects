import { VStack, Text, HStack, Flex, Box } from "@chakra-ui/react"; // import Chakra UI components for layout, stacking, and text
import { FaHeart } from "react-icons/fa"; // import filled heart icon for liked state
import { FaRegHeart } from "react-icons/fa"; // import outlined heart icon for unliked state
import { toggleLike } from "../api/endpoints"; // import API function to toggle like on a post
import { useState } from "react"; // import useState hook to manage component state

const Post = ({ id, username, description, formatted_date, liked, like_count }) => { // define a functional component to render a post with props
    const [clientLiked, setClientLiked] = useState(liked) // state to track whether the current user liked the post
    const [clientLikeCount, setClientLikeCount] = useState(like_count) // state to track current like count

    const handleToggleLike = async () => { // define a function to toggle like status for the post
        const data = await toggleLike(id); // call API to toggle like for the given post ID
        
        if (data.now_liked) { // if post is now liked after API call
            setClientLiked(true) // update state to liked
            setClientLikeCount(clientLikeCount + 1) // increment like count
        } else { // if post is now unliked
            setClientLiked(false) // update state to unliked
            setClientLikeCount(clientLikeCount - 1) // decrement like count
        }
    }

    return (
        <VStack w='400px' h='400px' border='1px solid' borderColor='gray.400' borderRadius='8px'> {/* vertical stack container for post with fixed size, border, and rounded corners */}
            <HStack w='100%' flex='1' borderBottom='1px solid' borderColor='gray.300' p='0 20px' bg='gray.50' borderRadius='8px 8px 0 0'> {/* horizontal stack for post header with username */}
                <Text>@{username}</Text> {/* display post author's username */}
            </HStack>
            <Flex flex='6' w='100%' h='100%' justifyContent='center' alignItems='center'> {/* flex container for post content */}
                <Text textAlign='center'>{description}</Text> {/* display post description */}
            </Flex>
            <Flex flex='2' w='100%' justifyContent='center' alignItems='center' borderTop='1px solid' bg='gray.50' borderColor='gray.400' borderRadius='0 0 8px 8px'> {/* flex container for post footer with likes and date */}
                <HStack w='90%' justifyContent='space-between'> {/* horizontal stack to space like section and date */}
                    <HStack > {/* horizontal stack for like icon and count */}
                        <Box> {/* container for like icon */}
                            {
                                clientLiked ? // check if post is liked
                                    <Box color='red'> {/* red color for liked heart */}
                                        <FaHeart onClick={handleToggleLike} /> {/* filled heart icon, toggles like on click */}
                                    </Box>
                                    :
                                    <FaRegHeart onClick={handleToggleLike} /> // outlined heart icon for unliked state, toggles like on click
                            }
                        </Box>
                        <Text>{clientLikeCount}</Text> {/* display current like count */}
                    </HStack>
                    <Text>{formatted_date}</Text> {/* display formatted post date */}
                </HStack>
            </Flex>
        </VStack>
    )
}

export default Post; // export Post component for use in rendering posts
