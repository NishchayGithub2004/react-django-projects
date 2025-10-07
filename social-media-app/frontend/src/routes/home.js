import { Heading, VStack, Text, Flex, Button } from "@chakra-ui/react"; // import Chakra UI components for layout, text, and buttons
import { useEffect, useState } from "react"; // import React hooks for state and side effects
import { get_posts } from "../api/endpoints"; // import API function to fetch paginated posts
import Post from "../components/post"; // import Post component to render individual posts

const Home = () => { // define a functional component for the home page displaying posts
    const [posts, setPosts] = useState([]) // state to store fetched posts
    const [loading, setLoading] = useState(true) // state to track loading status
    const [nextPage, setNextPage] = useState(1) // state to track next page number for pagination

    const fetchData = async () => { // define a function to fetch posts from API
        const data = await get_posts(nextPage) // call API to get posts for current page
        setPosts([...posts, ...data.results]) // append fetched posts to existing posts
        setNextPage(data.next ? nextPage + 1 : null) // update next page or set to null if no more pages
    }

    useEffect(() => { // run effect once when component mounts
        try {
            fetchData() // fetch initial posts
        } catch { // handle errors if API call fails
            alert('error getting posts') // show error alert
        } finally {
            setLoading(false) // set loading to false after fetching attempt
        }
    }, []) // empty dependency array to run only on mount

    const loadMorePosts = () => { // define function to load more posts on button click
        if (nextPage) { // check if there is a next page
            fetchData() // fetch posts for next page
        }
    }

    return ( // return JSX for home page layout
        <Flex w='100%' justifyContent='center' pt='50px'> {/* flex container to center content horizontally */}
            <VStack alignItems='start' gap='20px' pb='50px'> {/* vertical stack for posts with spacing */}
                <Heading>Posts</Heading> {/* heading for posts section */}
                {
                    loading ? // check if data is still loading
                        <Text>Loading...</Text> // show loading text
                    :
                        posts ? // check if posts are available
                            posts.map((post) => { // map through posts array
                                return <Post 
                                    key={post.id} // unique key for each post
                                    id={post.id} // pass post ID
                                    username={post.username} // pass post author's username
                                    description={post.description} // pass post description
                                    formatted_date={post.formatted_date} // pass formatted date
                                    liked={post.liked} // pass liked status
                                    like_count={post.like_count} // pass like count
                                />
                            })    
                        :
                        <></> // render nothing if posts array is empty
                }
                {
                    nextPage && !loading && ( // show "Load More" button if there is a next page and not loading
                        <Button onClick={loadMorePosts} w='100%'>Load More</Button> // button to load more posts
                    )
                }
            </VStack>
        </Flex>
    )
}

export default Home; // export Home component for use in routes/pages
