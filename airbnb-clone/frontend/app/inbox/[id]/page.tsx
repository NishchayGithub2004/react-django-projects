import { getUserId } from "../../lib/actions"; // import server action to retrieve the currently authenticated user id
import apiService from "@/app/services/apiService"; // import API service abstraction to fetch conversation data from backend
import ConversationDetail from "@/app/components/inbox/ConversationDetail"; // import ConversationDetail component to render messages and chat UI
import { UserType } from "../page"; // import UserType to strongly type user-related fields in messages
import { getAccessToken } from "../../lib/actions"; // import server action to retrieve access token for authenticated API usage

export type MessageType = { // define message type to strictly describe the shape of chat messages
    id: string; // store unique identifier for the message
    name: string; // store display name associated with the message
    body: string; // store message content text
    conversationId: string; // store id of the conversation this message belongs to
    sent_to: UserType; // store recipient user information
    created_by: UserType // store sender user information
}

const ConversationPage = async ({ params }: { params: { id: string }}) => { // define async page component to render a specific conversation using route params
    const userId = await getUserId(); // fetch current user id to validate authentication
    
    const token = await getAccessToken(); // fetch access token required for authorized chat operations

    if (!userId || !token) { // guard route to prevent unauthenticated access to conversations
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    const conversation = await apiService.get(`/api/chat/${params.id}/`); // fetch conversation data including messages using conversation id

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <ConversationDetail 
                token={token} // pass access token to enable authenticated message actions
                userId={userId} // pass current user id to distinguish sent vs received messages
                messages={conversation.messages} // pass list of messages to be rendered in the conversation
                conversation={conversation.conversation} // pass conversation metadata required by chat UI
            />
        </main>
    )
}

export default ConversationPage;