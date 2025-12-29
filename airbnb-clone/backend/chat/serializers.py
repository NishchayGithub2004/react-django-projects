from rest_framework import serializers # import serializers to transform model instances into api-friendly representations
from .models import Conversation, ConversationMessage # import conversation-related models to define serializer data sources
from useraccount.serializers import UserDetailSerializer # import user detail serializer to nest user data within responses

class ConversationListSerializer(serializers.ModelSerializer): # define a serializer to represent conversation summaries in list views
    users = UserDetailSerializer(many=True, read_only=True) # serialize related users to expose conversation participants without allowing writes

    class Meta: # define metadata configuration for the conversation list serializer
        model = Conversation # specify the Conversation model as the data source
        fields = ("id", "users", "modified_at") # expose identifiers, participants, and last-modified timestamp for ordering and display

class ConversationDetailSerializer(serializers.ModelSerializer): # define a serializer to represent detailed conversation data
    users = UserDetailSerializer(many=True, read_only=True) # serialize related users to provide participant details in the conversation view

    class Meta: # define metadata configuration for the conversation detail serializer
        model = Conversation # specify the Conversation model as the data source
        fields = ("id", "users", "modified_at") # expose core conversation fields needed by the client

class ConversationMessageSerializer(serializers.ModelSerializer): # define a serializer to represent individual conversation messages
    sent_to = UserDetailSerializer(many=False, read_only=True) # serialize the recipient user to show who the message was sent to
    created_by = UserDetailSerializer(many=False, read_only=True) # serialize the sender user to show who authored the message

    class Meta: # define metadata configuration for the conversation message serializer
        model = ConversationMessage # specify the ConversationMessage model as the data source
        fields = ("id", "body", "sent_to", "created_by") # expose message content and related user context for chat rendering