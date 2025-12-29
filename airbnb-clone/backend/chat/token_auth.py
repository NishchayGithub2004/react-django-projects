from django.contrib.auth.models import AnonymousUser # import AnonymousUser to represent unauthenticated websocket connections
from channels.db import database_sync_to_async # import database_sync_to_async to safely run database queries in async middleware
from channels.middleware import BaseMiddleware # import BaseMiddleware to implement custom authentication logic for channels
from rest_framework_simplejwt.tokens import AccessToken # import AccessToken to decode and validate jwt access tokens
from useraccount.models import User # import User model to resolve authenticated users from token data

@database_sync_to_async
def get_user( # define a synchronous helper function to resolve a user from a jwt token key
    token_key, # receive the raw jwt token string extracted from the websocket query parameters
):
    try: # wrap token parsing and database lookup to handle invalid or expired tokens safely
        token = AccessToken(token_key) # decode and validate the jwt access token to extract its payload
        user_id = token.payload["user_id"] # extract the user id claim to identify the authenticated user
        return User.objects.get(pk=user_id) # fetch and return the matching user instance from the database
    
    except Exception: # catch any exception caused by invalid tokens or missing users
        return AnonymousUser # return an anonymous user to represent an unauthenticated connection

class TokenAuthMiddleware(BaseMiddleware): # define a custom middleware to authenticate websocket connections using jwt
    def __init__( # define the middleware initializer to wrap the inner application
        self, # reference the middleware instance to store the inner callable
        inner, # receive the inner application to be executed after authentication
    ):
        self.inner = inner # store the inner application for later invocation
    
    async def __call__( # define the async entry point for each websocket connection
        self, # reference the middleware instance to access stored state
        scope, # receive the connection scope containing metadata such as query string and user
        receive, # receive callable used to get incoming websocket events
        send, # send callable used to dispatch websocket events
    ):
        query = dict( # construct a dictionary of query parameters from the raw query string
            x.split("=") for x in scope["query_string"].decode().split("&") # split and decode query string into key value pairs
        )
        token_key = query.get("token") # extract the jwt token value passed as a query parameter
        scope["user"] = await get_user(token_key) # resolve and attach the authenticated user to the connection scope
        return await super().__call__(scope, receive, send) # continue execution of the inner application with updated scope