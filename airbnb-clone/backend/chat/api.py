from django.http import JsonResponse # import JsonResponse to return structured json responses to api clients
from rest_framework.decorators import api_view # import api_view to restrict views to specific http methods
from .models import Conversation # import Conversation model to query and create conversation records
from .serializers import ConversationListSerializer, ConversationDetailSerializer, ConversationMessageSerializer # import serializers to shape conversation and message response data
from useraccount.models import User # import User model to resolve participants when starting conversations

@api_view(["GET"]) # restrict this endpoint to handle only get requests for listing conversations
def conversations_list( # define an api view to return all conversations for the authenticated user
    request, # receive the request object to access the authenticated user context
):
    serializer = ConversationListSerializer( # initialize the serializer to convert conversation queryset into json
        request.user.conversations.all(), # fetch all conversations associated with the authenticated user
        many=True # indicate multiple conversation objects are being serialized
    )

    return JsonResponse(serializer.data, safe=False) # return serialized conversation list as a json array response

@api_view(["GET"]) # restrict this endpoint to handle only get requests for conversation details
def conversations_detail( # define an api view to return a single conversation with its messages
    request, # receive the request object to identify the requesting user
    pk, # receive the primary key of the conversation to retrieve
):
    conversation = request.user.conversations.get(pk=pk) # retrieve the conversation ensuring it belongs to the requesting user
    conversation_serializer = ConversationDetailSerializer( # serialize the conversation metadata
        conversation, # pass the conversation instance to be serialized
        many=False # indicate a single conversation object
    )
    messages_serializer = ConversationMessageSerializer( # serialize all messages belonging to the conversation
        conversation.messages.all(), # fetch all messages related to the conversation
        many=True # indicate multiple message objects are being serialized
    )

    return JsonResponse( # return a structured json response containing conversation and messages
        {
            "conversation": conversation_serializer.data, # include serialized conversation details
            "messages": messages_serializer.data # include serialized list of conversation messages
        },
        safe=False # allow non-dict top-level values inside nested response data
    )

@api_view(["GET"]) # restrict this endpoint to handle only get requests for starting or retrieving a conversation
def conversations_start( # define an api view to start or reuse a conversation between two users
    request, # receive the request object to access the authenticated user
    user_id, # receive the target user id to start a conversation with
):
    conversations = Conversation.objects.filter( # query existing conversations between the two users
        users__in=[user_id] # filter conversations that include the target user
    ).filter(
        users__in=[request.user.id] # further filter conversations that also include the authenticated user
    )

    if conversations.count() > 0: # check whether a conversation already exists between the users
        conversation = conversations.first() # retrieve the first existing conversation to reuse it
        
        return JsonResponse( # return a success response with the existing conversation id
            {
                "success": True, # indicate the operation completed successfully
                "conversation_id": conversation.id # return the identifier of the existing conversation
            }
        )
    
    else: # handle the case where no existing conversation is found
        user = User.objects.get(pk=user_id) # retrieve the target user to add them to a new conversation
        conversation = Conversation.objects.create() # create a new empty conversation instance
        conversation.users.add(request.user) # add the authenticated user as a participant in the conversation
        conversation.users.add(user) # add the target user as the second participant in the conversation

        return JsonResponse( # return a success response with the newly created conversation id
            {
                "success": True, # indicate the conversation was created successfully
                "conversation_id": conversation.id # return the identifier of the new conversation
            }
        )