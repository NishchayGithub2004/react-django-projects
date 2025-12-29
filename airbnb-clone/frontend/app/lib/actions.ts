'use server';

import { cookies, // import cookies to read and mutate HTTP cookies on the server
} from 'next/headers';

export async function handleRefresh() { // define a server action to refresh the access token using the refresh token
    console.log('handleRefresh'); // log invocation for debugging refresh flow execution

    const refreshToken = await getRefreshToken(); // retrieve the refresh token from secure cookies to request a new access token
    
    if (!refreshToken) { // check whether a refresh token exists to determine if refresh is possible
        await resetAuthCookies(); // clear all authentication cookies to force a clean unauthenticated state
        return null; // return null to signal that token refresh failed
    }

    const token = await fetch('http://localhost:8000/api/auth/token/refresh/', { // send a refresh request to the authentication backend
        method: 'POST', // use POST as required by the token refresh endpoint
        body: JSON.stringify({ // serialize refresh token payload for backend consumption
            refresh: refreshToken // include the refresh token to obtain a new access token
        }),
        headers: { // define request headers for JSON-based API communication
            Accept: 'application/json', // indicate expected JSON response format
            'Content-Type': 'application/json' // specify JSON request body encoding
        }
    })
        .then(response => response.json()) // parse the HTTP response body into JSON for inspection
        .then(async (json) => { // handle parsed refresh response payload asynchronously
            console.log('Response - Refresh:', json); // log backend refresh response for debugging

            if (json.access) { // verify backend returned a new access token
                const cookieStore = await cookies(); // access the server-side cookie store to persist session data

                cookieStore.set('session_access_token', json.access, { // store new access token to maintain authenticated session
                    httpOnly: true, // prevent client-side JavaScript access to mitigate XSS
                    secure: false, // disable HTTPS-only restriction for local development environments
                    maxAge: 60 * 60, // set token expiry to one hour to align with backend access token lifetime
                    path: '/' // make cookie available across the entire application
                });

                return json.access; // return new access token for immediate server-side use
            } 
            
            else { // handle refresh response that does not include a valid access token
                await resetAuthCookies(); // clear all authentication cookies due to invalid refresh result
                return null; // return null to indicate authentication failure
            }
        })
        .catch(async (error) => { // catch network or parsing errors during refresh request
            console.log('error', error); // log refresh failure details for diagnostics
            await resetAuthCookies(); // clear cookies to avoid inconsistent authentication state
            return null; // return null to signal refresh operation failure
        });

    return token; // return the resolved access token or null to the caller
}

export async function handleLogin( // define a server action to persist authentication data after successful login
    userId: string, // accept user identifier to associate session with a specific user
    accessToken: string, // accept short-lived access token for authenticated requests
    refreshToken: string // accept long-lived refresh token for future access renewal
) {
    const cookieStore = await cookies(); // obtain cookie store to persist login session state

    // persist authenticated session identifiers and tokens with appropriate lifetimes
    cookieStore.set('session_userid', userId, { // store user identifier to identify the logged-in user
        httpOnly: true, // restrict access to server-side only for security
        secure: false, // disable secure flag for non-HTTPS development environments
        maxAge: 60 * 60 * 24 * 7, // retain user session for one week
        path: '/' // allow access across all routes
    });

    cookieStore.set('session_access_token', accessToken, { // store access token for authorized API requests
        httpOnly: true, // prevent client-side access to sensitive token
        secure: false, // disable HTTPS-only requirement for development
        maxAge: 60 * 60, // expire access token after one hour
        path: '/' // scope token to entire application
    });

    cookieStore.set('session_refresh_token', refreshToken, { // store refresh token for renewing access tokens
        httpOnly: true, // protect refresh token from client-side JavaScript
        secure: false, // allow usage in local development without HTTPS
        maxAge: 60 * 60 * 24 * 7, // keep refresh token valid for one week
        path: '/' // make refresh token available application-wide
    });
}

export async function resetAuthCookies() { // define a utility to clear all authentication-related cookies
    const cookieStore = await cookies(); // access cookie store to remove persisted session data
    cookieStore.set('session_userid', '', { maxAge: 0, path: '/' }); // immediately expire stored user identifier
    cookieStore.set('session_access_token', '', { maxAge: 0, path: '/' }); // immediately invalidate access token cookie
    cookieStore.set('session_refresh_token', '', { maxAge: 0, path: '/' }); // immediately invalidate refresh token cookie
}

export async function getUserId() { // define a helper to retrieve the current authenticated user id
    const cookieStore = await cookies(); // read cookies from the current server request context
    const userId = cookieStore.get('session_userid')?.value; // extract stored user identifier value if present
    return userId ?? null; // return user id or null when unauthenticated
}

export async function getAccessToken() { // define a helper to retrieve a valid access token for server requests
    const cookieStore = await cookies(); // access cookies to read current access token
    let accessToken = cookieStore.get('session_access_token')?.value; // attempt to read existing access token from cookies
    if (!accessToken) accessToken = await handleRefresh(); // refresh access token when missing or expired
    return accessToken; // return a valid access token or null if refresh fails
}

export async function getRefreshToken() { // define a helper to retrieve the refresh token from cookies
    const cookieStore = await cookies(); // access cookie store for refresh token lookup
    return cookieStore.get('session_refresh_token')?.value ?? null; // return refresh token or null if absent
}