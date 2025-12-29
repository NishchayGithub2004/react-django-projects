'use client';

import { useRouter } from "next/navigation"; // import router hook to enable client-side navigation from menu actions
import { useState } from "react"; // import useState hook to manage dropdown open and close state
import MenuLink from "./MenuLink"; // import MenuLink component to render individual menu actions
import LogoutButton from "../LogoutButton"; // import LogoutButton component to handle logout flow
import useLoginModal from "@/app/hooks/useLoginModal"; // import custom hook to control login modal visibility
import useSignupModal from "@/app/hooks/useSignupModal"; // import custom hook to control signup modal visibility

interface UserNavProps { // define props interface to type user authentication state
    userId?: string | null; // store optional user id to determine authenticated vs guest menu
}

const UserNav: React.FC<UserNavProps> = ({ // define a functional component named 'UserNav' to render user navigation menu which takes following props
    userId // receive user id to decide which menu options to display
}) => {
    const router = useRouter(); // initialize router to navigate to different user-related pages
    
    const loginModal = useLoginModal(); // initialize login modal hook for unauthenticated users
    
    const signupModal = useSignupModal(); // initialize signup modal hook for new user registration
    
    const [isOpen, setIsOpen] = useState(false); // store whether the dropdown menu is currently open or closed

    console.log('asdf', userId); // log user id for debugging authentication state during development

    return (
        <div className="p-2 relative inline-block border rounded-full">
            <button 
                onClick={() => setIsOpen(!isOpen)} // toggle dropdown open state when menu button is clicked
                className="flex items-center"
            >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            </button>

            {isOpen && ( // conditionally render dropdown menu only when open state is true
                <div className="w-[220px] absolute top-[60px] right-0 bg-white border rounded-xl shadow-md flex flex-col cursor-pointer">
                    {userId ? ( // render authenticated user menu when user id exists
                        <>
                            <MenuLink
                                label='Inbox'
                                onClick={() => { // handle navigation to inbox and close menu
                                    setIsOpen(false); // close dropdown after click
                                    router.push('/inbox'); // navigate to inbox page
                                }}
                            />

                            <MenuLink
                                label='My properties'
                                onClick={() => { // handle navigation to user-owned properties
                                    setIsOpen(false); // close dropdown after click
                                    router.push('/myproperties'); // navigate to properties management page
                                }}
                            />

                            <MenuLink
                                label='My favorites'
                                onClick={() => { // handle navigation to favorite properties
                                    setIsOpen(false); // close dropdown after click
                                    router.push('/myfavorites'); // navigate to favorites page
                                }}
                            />

                            <MenuLink
                                label='My reservations'
                                onClick={() => { // handle navigation to reservations list
                                    setIsOpen(false); // close dropdown after click
                                    router.push('/myreservations'); // navigate to reservations page
                                }}
                            />

                            <LogoutButton /> 
                        </>
                    ) : ( // render guest menu when user is not authenticated
                        <>
                            <MenuLink 
                                label='Log in'
                                onClick={() => { // handle login option click
                                    setIsOpen(false); // close dropdown before opening modal
                                    loginModal.open(); // open login modal
                                }}
                            />

                            <MenuLink 
                                label='Sign up'
                                onClick={() => { // handle signup option click
                                    setIsOpen(false); // close dropdown before opening modal
                                    signupModal.open(); // open signup modal
                                }}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default UserNav;