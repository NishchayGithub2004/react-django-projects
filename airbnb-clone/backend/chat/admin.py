from django.contrib import admin # import django admin module to register models for admin interface access
from .models import Conversation, ConversationMessage # import conversation-related models to expose them in the admin panel

admin.site.register(Conversation) # register the Conversation model to allow admin users to manage conversations
admin.site.register(ConversationMessage) # register the ConversationMessage model to allow admin users to manage messages