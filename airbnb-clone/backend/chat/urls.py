from django.urls import path # import path to define url patterns for routing http requests
from . import api # import api module to reference conversation-related view functions

urlpatterns = [ # define a list of url patterns for the conversation api endpoints
    path("", api.conversations_list, name="api_conversations_list"), # map the root path to list all conversations for the authenticated user
    path("start/<uuid:user_id>/", api.conversations_start, name="api_conversations_start"), # map the start endpoint to create or fetch a conversation with a specific user
    path("<uuid:pk>/", api.conversations_detail, name="api_conversations_detail"), # map the detail endpoint to retrieve a specific conversation and its messages
]