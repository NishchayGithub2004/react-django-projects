import uuid # import uuid to generate universally unique identifiers for primary keys to ensure global uniqueness
from django.db import models # import django models to define database-backed ORM models
from useraccount.models import User # import User model to establish relationships between conversations and users

class Conversation(models.Model): # define a database model named Conversation to represent a chat thread between users
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # define a non-editable UUID primary key to uniquely identify each conversation
    users = models.ManyToManyField(User, related_name="conversations") # associate multiple users with a conversation to model participants in the chat
    created_at = models.DateTimeField(auto_now_add=True) # store the timestamp when the conversation is first created for auditing and ordering
    modified_at = models.DateTimeField(auto_now=True) # update the timestamp on every save to track the latest modification to the conversation

class ConversationMessage(models.Model): # define a database model named ConversationMessage to represent individual messages in a conversation
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # define a non-editable UUID primary key to uniquely identify each message
    conversation = models.ForeignKey(Conversation, related_name="messages", on_delete=models.CASCADE) # link the message to its parent conversation and delete it if the conversation is removed
    body = models.TextField() # store the full textual content of the message without length restrictions
    sent_to = models.ForeignKey(User, related_name="received_messages", on_delete=models.CASCADE) # reference the recipient user to track who received the message
    created_by = models.ForeignKey(User, related_name="sent_messages", on_delete=models.CASCADE) # reference the sender user to track who authored the message
    created_at = models.DateTimeField(auto_now_add=True) # record the exact time the message was created to preserve message chronology