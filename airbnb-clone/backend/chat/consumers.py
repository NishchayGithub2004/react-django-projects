import json # import json to serialize and deserialize websocket payloads for message exchange
from asgiref.sync import sync_to_async # import sync_to_async to safely call synchronous database logic from async context
from channels.generic.websocket import AsyncWebsocketConsumer # import AsyncWebsocketConsumer to handle websocket connections asynchronously
from .models import ConversationMessage # import ConversationMessage model to persist chat messages in the database

class ChatConsumer(AsyncWebsocketConsumer): # define a websocket consumer to manage real-time chat communication
    async def connect( # define a method to handle a new websocket connection
        self, # reference the current consumer instance to access connection state
    ):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"] # extract the room name from the websocket URL to identify the chat room
        self.room_group_name = f"chat_{self.room_name}" # build a unique channel group name to broadcast messages within the same room

        await self.channel_layer.group_add( # add the current websocket channel to the room group for message broadcasting
            self.room_group_name, # specify the target group representing the chat room
            self.channel_name # provide the current channel identifier to join the group
        )

        await self.accept() # accept the websocket connection to allow data transmission

    async def disconnect( # define a method to handle websocket disconnection
        self, # reference the current consumer instance to clean up resources
    ):
        await self.channel_layer.group_discard( # remove the websocket channel from the room group on disconnect
            self.room_group_name, # specify the group to leave to stop receiving room messages
            self.channel_name # identify the channel being removed from the group
        )

    async def receive( # define a method to handle incoming websocket messages
        self, # reference the consumer instance to access scope and channel layer
        text_data, # receive raw text data sent from the websocket client
    ):
        data = json.loads(text_data) # parse the incoming JSON payload into a python dictionary

        conversation_id = data["data"]["conversation_id"] # extract the conversation identifier to associate the message with a thread
        sent_to_id = data["data"]["sent_to_id"] # extract the recipient user id to track message delivery
        name = data["data"]["name"] # extract the sender name to broadcast display information
        body = data["data"]["body"] # extract the message body containing the actual chat content

        await self.channel_layer.group_send( # broadcast the message to all websocket clients in the same room
            self.room_group_name, # target the channel group associated with the conversation room
            {
                "type": "chat_message", # specify the handler method name for receiving clients
                "body": body, # include the message body to be delivered to clients
                "name": name # include the sender name for display on the client side
            }
        )

        await self.save_message( # persist the message to the database asynchronously
            conversation_id, # pass the conversation id to link the message to its conversation
            body, # pass the message body to store the chat content
            sent_to_id # pass the recipient id to record who the message was sent to
        )
    
    async def chat_message( # define a handler to send broadcast messages to the websocket client
        self, # reference the consumer instance to send data over the socket
        event, # receive the event payload sent by the channel layer
    ):
        body = event["body"] # extract the message body from the broadcast event
        name = event["name"] # extract the sender name from the broadcast event

        await self.send( # send the message payload to the connected websocket client
            text_data=json.dumps({ # serialize the outgoing message data into JSON format
                "body": body, # include the message body for client-side rendering
                "name": name # include the sender name for identification on the client
            })
        )

    @sync_to_async
    def save_message( # define a synchronous database operation wrapped for async execution
        self, # reference the consumer instance to access the authenticated user
        conversation_id, # receive the conversation id to associate the message correctly
        body, # receive the message body to store textual content
        sent_to_id, # receive the recipient user id to track message direction
    ):
        user = self.scope["user"] # retrieve the authenticated user from the websocket scope as the message sender

        ConversationMessage.objects.create( # create a new ConversationMessage record in the database
            conversation_id=conversation_id, # assign the conversation foreign key to link the message to its thread
            body=body, # store the actual chat message content
            sent_to_id=sent_to_id, # store the recipient user reference for message routing
            created_by=user # store the sender user reference for authorship tracking
        )