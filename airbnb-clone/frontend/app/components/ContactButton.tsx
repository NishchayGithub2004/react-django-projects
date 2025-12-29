'use client';

import useLoginModal from "../hooks/useLoginModal"; // import custom hook to control the login modal visibility
import { useRouter } from "next/navigation"; // import Next.js router hook to perform client-side navigation
import apiService from "../services/apiService"; // import API service abstraction to communicate with backend endpoints

interface ContactButtonProps { // define the props interface to strongly type data required by ContactButton
    userId: string | null; // store the currently logged-in user id or null when user is not authenticated
    landlordId: string; // store the landlord id to initiate a chat conversation with
}

const ContactButton: React.FC<ContactButtonProps> = ({ // define a functional component named 'ContactButton' to allow users to contact a landlord which takes following props
    userId, // receive userId to determine whether user is authenticated
    landlordId // receive landlordId to know whom to start the conversation with
}) => {
    const loginModal = useLoginModal(); // initialize login modal hook to prompt authentication when needed
    
    const router = useRouter(); // initialize router to redirect user to the inbox after conversation starts

    const startConversation = async () => { // define an async function to either start a chat or prompt login
        if (userId) { // check if the user is authenticated before attempting to start a conversation
            const conversation = await apiService.get(`/api/chat/start/${landlordId}/`); // call backend API to create or fetch a conversation with the landlord

            if (conversation.conversation_id) { // verify that a valid conversation id was returned from the API
                router.push(`/inbox/${conversation.conversation_id}`); // navigate user to the specific conversation inbox
            }
        } else {
            loginModal.open(); // open the login modal when user is not authenticated
        }
    }

    return (
        <div 
            onClick={startConversation} // attach click handler to trigger conversation flow or login prompt
            className="mt-6 py-4 px-6 cursor-pointer bg-airbnb text-white rounded-xl hover:bg-airbnb-dark transition"
        >
            Contact
        </div>
    )
}

export default ContactButton;