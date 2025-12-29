import { getAccessToken } from "../lib/actions"; // import getAccessToken to retrieve a valid access token for authenticated API requests

const apiService = { // define a centralized API service object to standardize HTTP requests
    get: async function (url: string): Promise<any> { // define a GET request helper to fetch data from protected endpoints
        console.log('get', url); // log request type and URL for debugging outbound API calls

        const token = await getAccessToken(); // retrieve a valid access token to authorize the GET request

        return new Promise((resolve, reject) => { // wrap fetch in a promise to explicitly control resolve and reject behavior
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, { // build full API URL using environment configuration
                method: 'GET', // specify HTTP GET method to retrieve data
                headers: { // attach headers required for authenticated JSON requests
                    'Accept': 'application/json', // declare expected JSON response format
                    'Content-Type': 'application/json', // indicate JSON request semantics even without a body
                    'Authorization': `Bearer ${token}` // attach bearer token to authorize the request
                }
            })
                .then(response => response.json()) // parse the HTTP response body into JSON
                .then((json) => { // handle parsed JSON response
                    console.log('Response:', json); // log API response payload for inspection
                    resolve(json); // resolve the promise with parsed response data
                })
                .catch((error => { // catch network or parsing errors during the request
                    reject(error); // reject the promise to propagate request failure
                }))
        })
    },

    post: async function ( // define a POST request helper for authenticated data submission
        url: string, // accept endpoint path to determine where the POST request is sent
        data: any // accept request payload to be transmitted to the backend
    ): Promise<any> {
        console.log('post', url, data); // log request type, URL, and payload for debugging submissions

        const token = await getAccessToken(); // retrieve access token to authorize the POST request

        return new Promise((resolve, reject) => { // create a promise wrapper to manage async fetch result
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, { // construct full endpoint URL using environment variable
                method: 'POST', // specify HTTP POST method to send data
                body: data, // attach provided payload directly as request body
                headers: { // define headers required for authenticated submission
                    'Authorization': `Bearer ${token}` // include bearer token to authenticate the request
                }
            })
                .then(response => response.json()) // convert response body into JSON
                .then((json) => { // process parsed JSON response
                    console.log('Response:', json); // log backend response for verification
                    resolve(json); // resolve promise with response payload
                })
                .catch((error => { // handle fetch or parsing errors
                    reject(error); // reject promise to surface error to caller
                }))
        })
    },

    postWithoutToken: async function ( // define a POST helper for unauthenticated endpoints
        url: string, // accept endpoint path for unauthenticated request
        data: any // accept payload to send without authorization headers
    ): Promise<any> {
        console.log('post', url, data); // log request details to trace unauthenticated calls

        return new Promise((resolve, reject) => { // wrap fetch to explicitly manage async control flow
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, { // resolve full API endpoint using environment configuration
                method: 'POST', // use POST method to submit data
                body: data, // include provided payload in request body
                headers: { // define headers for JSON-based unauthenticated requests
                    'Accept': 'application/json', // indicate expected response type
                    'Content-Type': 'application/json' // specify JSON content encoding
                }
            })
                .then(response => response.json()) // parse HTTP response into JSON
                .then((json) => { // handle parsed response data
                    console.log('Response:', json); // log response for debugging and visibility
                    resolve(json); // resolve promise with response payload
                })
                .catch((error => { // capture request or parsing failures
                    reject(error); // reject promise to propagate error state
                }))
        })
    }
}

export default apiService; // export apiService to provide a reusable API abstraction across the application