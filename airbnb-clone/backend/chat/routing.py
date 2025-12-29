from django.urls import path # import path to define websocket url routing patterns
from . import consumers # import consumers module to reference websocket consumer classes

websocket_urlpatterns = [ # define a list of websocket url patterns to be registered with the channels router
    path( # define a websocket route pattern
        "ws/<str:room_name>/", # declare a dynamic websocket url segment to capture the chat room name
        consumers.ChatConsumer.as_asgi(), # bind the ChatConsumer as an asgi application to handle this route
    ),
]