import { getUserId } from "../lib/actions"; // import server action to retrieve the currently authenticated user id
import apiService from "../services/apiService"; // import API service abstraction to fetch inbox conversations from backend
import Conversation from "../components/inbox/Conversation"; // import Conversation component to render individual conversation previews

export type UserType = { // define user type to strictly describe participants in conversations
    id: string; // store unique identifier of the user
    name: string; // store display name of the user
    avatar_url: string; // store avatar image url of the user
}

export type ConversationType = { // define conversation type to strictly describe inbox conversation objects
    id: string; // store unique identifier of the conversation
    users: UserType[]; // store list of users participating in the conversation
}

const InboxPage = async () => { // define async page component to render inbox conversations for the logged-in user
    const userId = await getUserId(); // fetch current user id to validate authentication state

    if (!userId) { // guard route to prevent unauthenticated access to inbox
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    const conversations = await apiService.get('/api/chat/'); // fetch all conversations associated with the current user

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6 space-y-4">
            <h1 className="my-6 text-2xl">Inbox</h1>

            {conversations.map((conversation: ConversationType) => { // iterate over conversations to render each one
                return (
                    <Conversation 
                        userId={userId} // pass current user id to identify sender vs receiver in conversation
                        key={conversation.id} // provide stable key for React list rendering
                        conversation={conversation} // pass full conversation data to child component
                    />
                )
            })}
        </main>
    )
}

export default InboxPage;