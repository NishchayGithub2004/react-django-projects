'use client';

import { useRouter } from "next/navigation"; // import useRouter to enable client-side navigation within the Next.js app
import { ConversationType } from "@/app/inbox/page"; // import ConversationType to strongly type the conversation data structure

interface ConversationProps { // define props interface to describe data required to render a conversation item
    conversation: ConversationType; // store conversation data including users and conversation id
    userId: string; // store current user id to determine the other participant in the conversation
}

// define a functional component named 'Conversation' to render a single conversation preview which takes following props
const Conversation: React.FC<ConversationProps> = ({
    conversation, // receive conversation object to display relevant conversation details
    userId // receive current user id to identify the other participant
}) => {
    const router = useRouter(); // initialize Next.js router to handle navigation on user interaction
    
    const otherUser = conversation.users.find((user) => user.id != userId); // find the conversation participant who is not the current user

    return (
        <div className="px-6 py-4 cursor-pointer border border-gray-300 rounded-xl">
            <p className="mb-6 text-xl">{otherUser?.name}</p> {/* safely render the other participant's name using optional chaining to avoid runtime errors */}

            <p
                onClick={() => router.push(`/inbox/${conversation.id}`)} // navigate to the selected conversation when clicked
                className="text-airbnb-dark"
            >
                Go to conversation
            </p>
        </div>
    )
}

export default Conversation; // export component to allow rendering conversation previews in inbox views