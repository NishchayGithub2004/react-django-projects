import { Text, VStack, Flex, Box, Heading, HStack, Image, Button, Spacer } from "@chakra-ui/react"; // import Chakra UI components for layout, text, images, buttons, and spacing
import { useState, useEffect } from "react"; // import React hooks for state management and side effects
import { get_user_profile_data, get_users_posts, toggleFollow } from "../api/endpoints"; // import API functions for fetching user data, posts, and toggling follow
import { SERVER_URL } from "../constants/constants"; // import server URL constant
import Post from "../components/post"; // import Post component to display individual posts

const UserDetails = ({ username }) => { // define a functional component to display user details
    const [loading, setLoading] = useState(true) // state to track loading status
    const [bio, setBio] = useState('') // state to store user's bio
    const [profileImage, setProfileImage] = useState('') // state to store profile image URL
    const [followerCount, setFollowerCount] = useState(0) // state to store number of followers
    const [followingCount, setFollowingCount] = useState(0) // state to store number of following
    const [isOurProfile, setIsOurProfile] = useState(false) // state to check if viewing own profile
    const [following, setFollowing] = useState(false) // state to track if current user is following this profile

    const handleToggleFollow = async () => { // define function to handle follow/unfollow
        const data = await toggleFollow(username); // call API to toggle follow status
        
        if (data.now_following) { // if user is now following
            setFollowerCount(followerCount + 1) // increment follower count
            setFollowing(true) // update following state
        } else { // if user is now unfollowed
            setFollowerCount(followerCount - 1) // decrement follower count
            setFollowing(false) // update following state
        }
    }

    useEffect(() => { // useEffect to fetch user profile data on component mount
        const fetchData = async () => {
            try {
                const data = await get_user_profile_data(username); // fetch user profile data from API
                setBio(data.bio) // update bio state
                setProfileImage(data.profile_image) // update profile image state
                setFollowerCount(data.follower_count) // update follower count state
                setFollowingCount(data.following_count) // update following count state
                setIsOurProfile(data.is_our_profile) // update own profile check state
                setFollowing(data.following) // update following state
            } catch { // handle error
                console.log('error') // log error to console
            } finally {
                setLoading(false) // set loading to false after fetching
            }
        }
        
        fetchData() // call fetchData function
    }, []) // empty dependency array ensures it runs only once

    return ( // return JSX for user details section
        <VStack w='100%' alignItems='start' gap='40px'> {/* vertical stack for user details */}
            <Heading>@{username}</Heading> {/* display username */}
            <HStack gap='20px'> {/* horizontal stack for profile image and stats */}
                <Box boxSize='150px' border='2px solid' borderColor='gray.700' bg='white' borderRadius='full' overflow='hidden'> {/* circular container for profile image */}
                    <Image src={loading ? '' : `${SERVER_URL}${profileImage}`} boxSize='100%' objectFit='cover' /> {/* display profile image if not loading */}
                </Box>
                <VStack gap='20px'> {/* vertical stack for follower/following counts and buttons */}
                    <HStack gap='20px' fontSize='18px'> {/* horizontal stack for counts */}
                        <VStack> {/* followers count */}
                            <Text>Followers</Text>
                            <Text>{ loading ? '-' : followerCount}</Text> {/* display follower count or placeholder */}
                        </VStack>
                        <VStack> {/* following count */}
                            <Text>Following</Text>
                            <Text>{ loading ? '-' : followingCount}</Text> {/* display following count or placeholder */}
                        </VStack>
                    </HStack>
                    {
                        loading ? // show placeholder if loading
                            <Spacer /> 
                        : 
                            isOurProfile ? // if own profile
                                <Button w='100%'>Edit Profile</Button> // show edit button
                            : // if viewing another profile
                                <Button onClick={handleToggleFollow} colorScheme="blue" w='100%'>{following ? 'Unfollow' : 'Follow'}</Button> // show follow/unfollow button
                    }               
                </VStack>
            </HStack>
            <Text fontSize='18px'>{ loading ? '-' : bio}</Text> {/* display bio or placeholder */}
        </VStack>
    )
}

const UserPosts = ({ username }) => { // define functional component to display user's posts
    const [posts, setPosts] = useState([]) // state to store posts
    const [loading, setLoading] = useState(true) // state to track loading

    useEffect(() => { // fetch posts on component mount
        const fetchPosts = async () => {
            try {
                const posts = await get_users_posts(username) // call API to get user's posts
                setPosts(posts) // update posts state
            } catch { // handle error
                alert('error getting users posts') // show alert on error
            } finally {
                setLoading(false) // set loading to false after fetching
            }
        }

        fetchPosts() // call fetchPosts function
    }, []) // empty dependency array ensures it runs only once

    return ( // return JSX for user's posts
        <Flex w='100%' wrap='wrap' gap='30px' pb='50px'> {/* flex container to wrap posts */}
            {loading ? // show placeholder if loading
                <Text>Loading...</Text>
            :
                posts.map((post) => { // map through posts and render Post components
                    return <Post 
                        key={post.id} 
                        id={post.id} 
                        username={post.username} 
                        description={post.description} 
                        formatted_date={post.formatted_date} 
                        liked={post.liked} 
                        like_count={post.like_count} 
                    />
                })
            }
        </Flex>
    )
}

const UserProfile = () => { // define main UserProfile component
    const get_username_from_url = () => { // helper function to extract username from URL
        const url_split = window.location.pathname.split('/'); // split pathname using '/' as delimiter
        return url_split[url_split.length - 1] // return last segment as username
    }

    const [username, setUsername] = useState(get_username_from_url()) // state to store username from URL

    useEffect(() => { // update username state if URL changes
        setUsername(get_username_from_url()) 
    }, [])

    return ( // return JSX for user profile page
        <Flex w='100%' justifyContent='center'> {/* flex container to center content */}
            <VStack w='75%'> {/* vertical stack for details and posts */}
                <Box w='100%' mt='40px'>
                    <UserDetails username={username} /> {/* render user details */}
                </Box>
                <Box w='100%' mt='50px'>
                    <UserPosts username={username} /> {/* render user's posts */}
                </Box>
            </VStack>
        </Flex>
    )
}

export default UserProfile; // export UserProfile component for use in routes/pages