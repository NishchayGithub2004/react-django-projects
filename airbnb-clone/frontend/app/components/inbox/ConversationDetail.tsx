'use client';

import {
    useEffect, // import useEffect to handle side effects such as websocket state changes and incoming messages
    useState, // import useState to manage local component state for messages and input
    useRef // import useRef to persist a mutable reference to the messages container DOM element
} from "react";

import CustomButton from "../forms/CustomButton"; // import CustomButton to render a reusable send action button
import { ConversationType } from "@/app/inbox/page"; // import ConversationType to strongly type conversation data
import useWebSocket from "react-use-websocket"; // import useWebSocket to manage realtime websocket communication
import { MessageType } from "@/app/inbox/[id]/page"; // import MessageType to type individual chat messages
import { UserType } from "@/app/inbox/page"; // import UserType to type user objects involved in the conversation

interface ConversationDetailProps { // define props interface to describe data required for conversation detail view
    token: string; // store authentication token used to authorize websocket connection
    userId: string; // store current user id to distinguish sender and receiver
    conversation: ConversationType; // store conversation metadata including users and id
    messages: MessageType[]; // store initial list of messages loaded from the server
}

// define a functional component named 'ConversationDetail' to render realtime chat conversation which takes following props
const ConversationDetail: React.FC<ConversationDetailProps> = ({
    userId, // receive current user id for message ownership resolution
    token, // receive auth token to authenticate websocket connection
    messages, // receive initial conversation messages
    conversation // receive conversation context and participants
}) => {
    const messagesDiv = useRef<HTMLDivElement>(null); // create a ref to control scrolling behavior of the messages container
    const [newMessage, setNewMessage] = useState(''); // manage state for the message input field
    const myUser = conversation.users?.find((user) => user.id == userId); // resolve current user object from conversation participants
    const otherUser = conversation.users?.find((user) => user.id != userId); // resolve the other participant in the conversation
    const [realtimeMessages, setRealtimeMessages] = useState<MessageType[]>([]); // store messages received in realtime via websocket

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket( // initialize websocket connection for the conversation
        `${process.env.NEXT_PUBLIC_WS_HOST}/ws/${conversation.id}/?token=${token}`, // construct websocket URL using environment config, conversation id, and auth token
        {
            share: false, // disable socket sharing to isolate this connection instance
            shouldReconnect: () => true, // automatically attempt to reconnect on connection loss
        },
    )

    useEffect(() => { // react to websocket connection state changes
        console.log("Connection state changed", readyState); // log connection readiness for debugging and monitoring
    }, [readyState]); // re-run effect whenever websocket ready state updates

    useEffect(() => { // handle incoming websocket messages
        if ( // validate incoming payload shape before processing
            lastJsonMessage && // ensure a message was actually received before accessing it
            typeof lastJsonMessage === 'object' && // confirm the payload is an object to avoid runtime type errors
            'name' in lastJsonMessage && // verify the payload contains a sender name field
            'body' in lastJsonMessage // verify the payload contains a message body field
        ) {
            const message: MessageType = { // construct a MessageType object from websocket payload
                id: '', // assign empty id since realtime messages may not yet be persisted
                name: lastJsonMessage.name as string, // map sender name from websocket data
                body: lastJsonMessage.body as string, // map message body content
                sent_to: otherUser as UserType, // assign recipient user based on conversation context
                created_by: myUser as UserType, // assign sender as current user
                conversationId: conversation.id // associate message with the active conversation
            }

            setRealtimeMessages((realtimeMessages) => [...realtimeMessages, message]); // append new realtime message to local state
        }

        scrollToBottom(); // ensure view scrolls to the latest message
    }, [lastJsonMessage]); // trigger effect whenever a new websocket message arrives

    const sendMessage = async () => { // define a handler to send a new chat message via websocket
        console.log('sendMessage'), // log message send attempt for debugging

        sendJsonMessage({ // transmit chat message payload to websocket server
            event: 'chat_message', // specify event type for backend routing
            data: { // include message payload data
                body: newMessage, // include message text from input state
                name: myUser?.name, // include sender name for display purposes
                sent_to_id: otherUser?.id, // include recipient user id
                conversation_id: conversation.id // include conversation identifier
            }
        });

        setNewMessage(''); // reset message input field after sending

        setTimeout(() => { // defer scrolling slightly to allow DOM to update
            scrollToBottom() // scroll to the latest message after send
        }, 50);
    }

    const scrollToBottom = () => { // define helper to scroll messages container to bottom
        if (messagesDiv.current) { // ensure messages container ref is available
            messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight; // force scroll position to the bottom of the container
        }
    }

    return (
        <>
            <div 
                ref={messagesDiv} // attach ref to access the messages container DOM node for scroll control
                className="max-h-[400px] overflow-auto flex flex-col space-y-4"
            >
                {messages.map((message, index) => ( // iterate over initial server-loaded messages to render chat history
                    <div
                        key={index} // use index as key to uniquely identify each rendered message element
                        className={`w-[80%]py-4 px-6 rounded-xl ${message.created_by.name == myUser?.name ? 'ml-[20%] bg-blue-200' : 'bg-gray-200'}`} // conditionally align and style message based on whether it was sent by the current user
                    >
                        <p className="font-bold text-gray-500">{message.created_by.name}</p> {/* display sender name for each historical message */}
                        <p>{message.body}</p> // render message text content
                    </div>
                ))}
    
                {realtimeMessages.map((message, index) => ( // iterate over realtime websocket messages to append live chat updates
                    <div
                        key={index} // use index as key to track each realtime-rendered message
                        className={`w-[80%]py-4 px-6 rounded-xl ${message.name == myUser?.name ? 'ml-[20%] bg-blue-200' : 'bg-gray-200'}`} // dynamically style message based on sender identity
                    >
                        <p className="font-bold text-gray-500">{message.name}</p> {/* render sender name from realtime payload */}
                        <p>{message.body}</p> {/* render realtime message body content */}
                    </div>
                ))}
            </div>
    
            <div className="mt-4 py-4 px-6 flex border border-gray-300 space-x-4 rounded-xl">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 bg-gray-200 rounded-xl"
                    value={newMessage} // bind input value to component state to keep it controlled
                    onChange={(e) => setNewMessage(e.target.value)} // update message state on each user keystroke
                />
    
                <CustomButton 
                    label='Send'
                    onClick={sendMessage} // trigger message send handler when user clicks the send button
                    className="w-[100px]"
                />
            </div>
        </>
    )    
}

export default ConversationDetail;