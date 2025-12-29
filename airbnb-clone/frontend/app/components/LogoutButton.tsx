'use client';

import { useRouter } from "next/navigation"; // import Next.js router hook to programmatically navigate after logout
import { resetAuthCookies } from '../lib/actions'; // import server action to clear authentication cookies
import MenuLink from "./navbar/MenuLink"; // import MenuLink component to render a clickable menu item

const LogoutButton: React.FC = () => { // define a functional component named 'LogoutButton' to log the user out of the application
    const router = useRouter(); // initialize router to redirect user after logout completes

    const submitLogout = async () => { // define an async function to clear auth state and redirect to home
        resetAuthCookies(); // remove authentication cookies to terminate the user session
        router.push('/'); // navigate user to the home page after logout
    }

    return (
        <MenuLink
            label="Log out"
            onClick={submitLogout} // attach logout handler to execute when the menu item is clicked
        />
    )
}

export default LogoutButton;