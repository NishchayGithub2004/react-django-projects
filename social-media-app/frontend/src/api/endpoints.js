import axios from 'axios' // import axios library to make HTTP requests
import { SERVER_URL } from '../constants/constants' // import SERVER_URL constant from local constants file

const BASE_URL = SERVER_URL // assign SERVER_URL to BASE_URL for easier reference

const api = axios.create({
    baseURL: BASE_URL, // set the base URL for all requests using this axios instance
    withCredentials: true // include credentials (cookies, auth headers) with requests
})

api.interceptors.response.use(
    (response) => response, // return response directly if no error occurs
    
    async error => { // handle errors globally for all responses
        const original_request = error.config // store original request config to retry if needed

        if (error.response?.status === 401 && !original_request._retry) { // check if unauthorized and request hasn't been retried
            original_request._retry = true; // mark request as retried to avoid infinite loops

            try {
                await refresh_token(); // call refresh_token function to get a new access token
                return api(original_request); // retry the original request with new token
            } catch (refreshError) { // if token refresh fails
                window.location.href = '/login' // redirect user to login page
                return Promise.reject(refreshError) // reject promise with refresh error
            }
        }
        
        return Promise.reject(error) // reject promise with original error if not handled
    }
)

export const get_user_profile_data = async (username) => { // define a function to get user profile data by username
    const response = await api.get(`/user_data/${username}/`) // send GET request to `/user_data/{username}/` endpoint to fetch user profile
    return response.data // return only the data from response
}

const refresh_token = async () => { // define a function to refresh authentication token
    const response = await api.post('/token/refresh/') // send POST request to `/token/refresh/` endpoint to get a new access token
    return response.data // return refreshed token data
}

export const login = async (username, password) => { // define a function to log in user with username and password
    const response = await api.post(
        '/token/', // POST request to `/token/` endpoint to get access and refresh tokens
        {
            username: username, // include username in request body
            password: password // include password in request body
        }
    )
    return response.data // return tokens from response
}

export const register = async (username, email, firstName, lastName, password) => { // define a function to register a new user
    const response = await api.post(
        '/register/', // POST request to `/register/` endpoint to create a new user
        {
            username: username, // include username
            email: email, // include email
            first_name: firstName, // include first name
            last_name: lastName, // include last name
            password: password // include password
        }
    )
    return response.data // return registered user data from response
}

export const get_auth = async () => { // define a function to check if user is authenticated
    const response = await api.get(`/authenticated/`) // GET request to `/authenticated/` endpoint to verify login status
    return response.data // return authentication status
}

export const toggleFollow = async (username) => { // define a function to follow/unfollow a user
    const response = await api.post(
        '/toggle_follow/', // POST request to `/toggle_follow/` endpoint to toggle follow status
        { username: username } // include target username in request body
    )
    return response.data // return updated follow status
}

export const get_users_posts = async (username) => { // define a function to fetch posts of a specific user
    const response = await api.get(`/posts/${username}/`) // GET request to `/posts/{username}/` endpoint to fetch user's posts
    return response.data // return posts data
}

export const toggleLike = async (id) => { // define a function to like/unlike a post
    const response = await api.post(
        '/toggleLike/', // POST request to `/toggleLike/` endpoint to toggle like on a post
        { id: id } // include post ID in request body
    )
    return response.data // return updated like status
}

export const create_post = async (description) => { // define a function to create a new post
    const response = await api.post(
        '/create_post/', // POST request to `/create_post/` endpoint to create a new post
        { description: description } // include post description in request body
    )
    return response.data // return created post data
}

export const get_posts = async (num) => { // define a function to fetch paginated posts
    const response = await api.get(`/get_posts/?page=${num}`) // GET request to `/get_posts/?page={num}` endpoint to get posts for a specific page
    return response.data // return posts for that page
}

export const search_users = async (search) => { // define a function to search users by query
    const response = await api.get(`/search/?query=${search}`) // GET request to `/search/?query={search}` endpoint to fetch matching users
    return response.data // return list of users matching search
}

export const logout = async () => { // define a function to log out user
    const response = await api.post('/logout/') // POST request to `/logout/` endpoint to log out user
    return response.data // return logout confirmation
}

export const update_user = async (values) => { // define a function to update user profile data
    const response = await api.patch(
        '/update_user/', // PATCH request to `/update_user/` endpoint to update user data
        values, // include updated user values (form data)
        { headers: { 'Content-Type': 'multipart/form-data' } } // set headers to handle file uploads
    )
    return response.data // return updated user data
}
