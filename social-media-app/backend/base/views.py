from rest_framework.decorators import api_view, permission_classes # import decorators to define API view types and set permission rules
from rest_framework.permissions import IsAuthenticated # import IsAuthenticated class to restrict access to authenticated users
from rest_framework.response import Response # import Response class to send JSON responses back to client

from rest_framework.pagination import PageNumberPagination # import PageNumberPagination to handle paginated API responses

from .models import MyUser, Post # import MyUser and Post models from current app’s models to use in API operations
from .serializers import MyUserProfileSerializer, UserRegisterSerializer, PostSerializer, UserSerializer # import serializers to convert model instances to and from JSON

from rest_framework_simplejwt.views import ( # import JWT view classes for token management
    TokenObtainPairView, # import TokenObtainPairView to obtain access and refresh tokens
    TokenRefreshView, # import TokenRefreshView to refresh JWT tokens when expired
)

@api_view(['GET']) # define a decorator to allow only GET requests for this view
@permission_classes([IsAuthenticated]) # define a decorator to ensure only authenticated users can access this view
def auhtenticated(request): # define a function auhtenticated to check and confirm user authentication, takes request object as argument
    return Response('authenticated!') # return a success message indicating the user is authenticated

@api_view(['POST']) # define a decorator to allow only POST requests for this view
def register(request): # define a function register to handle user registration, takes request object as argument
    serializer = UserRegisterSerializer( # create an instance of UserRegisterSerializer to validate and serialize incoming user data
        data=request.data # pass incoming request data as argument for serializer validation
    )
    
    if serializer.is_valid(): # check if provided data passes serializer validation rules
        serializer.save() # save validated data to create a new user instance in the database
        return Response(serializer.data) # return serialized user data as a response after successful registration
    
    return Response(serializer.errors) # return validation error messages if data is invalid

class CustomTokenObtainPairView(TokenObtainPairView): # define a class CustomTokenObtainPairView to customize token creation by extending TokenObtainPairView
    def post(self, request, *args, **kwargs): # define a method post to handle POST requests for token generation, takes request, *args, and **kwargs as arguments
        
        try: # start try block to handle exceptions during token generation
            response = super().post( # call parent class's post method to generate JWT tokens
                request, # pass request object containing login credentials
                *args, # pass positional arguments if any
                **kwargs # pass keyword arguments if any
            )
            tokens = response.data # extract generated token data from response

            access_token = tokens['access'] # extract access token string from token data
            refresh_token = tokens['refresh'] # extract refresh token string from token data
            username = request.data['username'] # get username from request data to identify user

            try: # start nested try block to fetch user from database
                user = MyUser.objects.get( # call get method on MyUser model to retrieve user instance
                    username=username # pass username as filter argument to fetch correct user
                )
            
            except MyUser.DoesNotExist: # handle exception if user with provided username does not exist
                return Response({'error': 'user does not exist'}) # return error response when user not found

            res = Response() # create an empty Response object to send custom response data

            res.data = { # assign response data dictionary to res.data
                "success": True, # indicate successful login operation
                "user": { # include user details dictionary
                    "username": user.username, # include user's username field
                    "bio": user.bio, # include user's bio field
                    "email": user.email, # include user's email field
                    "first_name": user.first_name, # include user's first name
                    "last_name": user.last_name # include user's last name
                }
            }

            res.set_cookie( # call set_cookie method to store access token in HTTP cookie
                key='access_token', # set cookie key name as 'access_token'
                value=access_token, # assign access token string as cookie value
                httponly=True, # restrict access to cookie from JavaScript for security
                secure=True, # ensure cookie is sent only over HTTPS
                samesite='None', # allow cross-site cookie sending by setting SameSite=None
                path='/' # make cookie accessible to all paths in domain
            )

            res.set_cookie( # call set_cookie again to store refresh token in cookie
                key='refresh_token', # set cookie key name as 'refresh_token'
                value=refresh_token, # assign refresh token string as cookie value
                httponly=True, # restrict cookie from being accessed by JavaScript
                secure=True, # enforce secure transmission of cookie over HTTPS
                samesite='None', # allow sending cookie in cross-site requests
                path='/' # make cookie accessible across all routes
            )

            return res # return response object containing user info and cookies

        except: # handle any exceptions that occur during token creation or response setup
            return Response({'success': False}) # return response indicating failure in token process

class CustomTokenRefreshView(TokenRefreshView): # define a class CustomTokenRefreshView to refresh JWT tokens using cookies, extending TokenRefreshView
    def post(self, request, *args, **kwargs): # define a method post to handle POST requests for refreshing tokens, takes request, *args, and **kwargs as arguments
            
        try: # start try block to safely handle token refresh process
            refresh_token = request.COOKIES.get('refresh_token') # get the 'refresh_token' value from client's cookies dictionary
            request.data['refresh'] = refresh_token # assign refresh token from cookies to request data so parent class can use it

            response = super().post( # call parent class post method to generate new access token
                request, # pass modified request object with refresh token
                *args, # pass positional arguments if any
                **kwargs # pass keyword arguments if any
            )
            tokens = response.data # extract newly generated token data from response

            access_token = tokens['access'] # extract the new access token string from tokens dictionary
            
            res = Response() # create a new Response object to send custom response back to client

            res.data = { # assign dictionary data to response body
                "success": True # indicate successful token refresh operation
            }

            res.set_cookie( # call set_cookie method to store new access token in client's cookies
                key='access_token', # set cookie name as 'access_token'
                value=access_token, # assign new access token string as cookie value
                httponly=True, # make cookie inaccessible from JavaScript for security
                secure=True, # ensure cookie is sent only through HTTPS
                samesite='None', # allow cross-site requests by setting SameSite=None
                path='/' # make cookie accessible to all endpoints in the domain
            )

            return res # return response with updated access token cookie
        
        except: # handle exceptions that occur during token refresh process
            return Response({'success': False}) # return JSON response indicating failure in refreshing token

@api_view(['GET']) # define decorator to allow only GET requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure that only authenticated users can access this view
def get_user_profile_data(request, pk): # define a function get_user_profile_data to retrieve a user's profile data, takes request and pk (username) as arguments
    try: # start try block to handle errors safely
        try: # nested try block to attempt fetching user from database
            user = MyUser.objects.get( # call get method to fetch MyUser instance from database
                username=pk # pass username (pk) as argument to find the specific user
            )
        
        except MyUser.DoesNotExist: # handle exception if user with given username does not exist
            return Response({'error': 'user does not exist'}) # return error response if user not found
        
        serializer = MyUserProfileSerializer( # create serializer instance to convert user model data into JSON
            user, # pass retrieved MyUser instance as first argument
            many=False # specify many=False since we are serializing a single object
        )

        following = False # initialize variable following as False to track if current user follows the target user

        if request.user in user.followers.all(): # check if authenticated user exists in target user's followers list
            following = True # set following to True if current user follows the target user

        return Response({ # return response dictionary containing serialized user data and follow status
            **serializer.data, # unpack serialized data into response dictionary
            'is_our_profile': request.user.username == user.username, # compare usernames to check if profile belongs to current user
            'following': following # include whether current user is following the target user
        })
    
    except: # handle any exception raised during profile retrieval
        return Response({'error': 'error getting user data'}) # return error response indicating problem retrieving user data
    
@api_view(['POST']) # define decorator to allow only POST requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure only authenticated users can access this view
def toggleFollow(request): # define a function toggleFollow to follow or unfollow another user, takes request as argument
    try: # start try block to handle errors during follow toggle process
        try: # nested try block to fetch user instances from database
            my_user = MyUser.objects.get( # call get method to fetch current logged-in user's MyUser instance
                username=request.user.username # pass current authenticated username as argument
            )
            user_to_follow = MyUser.objects.get( # call get method to fetch target user's MyUser instance
                username=request.data['username'] # pass target username extracted from request data as argument
            )
        
        except MyUser.DoesNotExist: # handle case when one or both users do not exist
            return Response({'error': 'users does not exist'}) # return error response when user not found
        
        if my_user in user_to_follow.followers.all(): # check if current user already exists in target user's followers list
            user_to_follow.followers.remove(my_user) # call remove method to unfollow user by removing relationship
            return Response({'now_following': False}) # return response indicating that user is no longer following
        
        else: # if user is not already following the target user
            user_to_follow.followers.add(my_user) # call add method to follow user by adding relationship
            return Response({'now_following': True}) # return response indicating that user is now following
    
    except: # handle any unexpected exception during follow toggle process
        return Response({'error': 'error following user'}) # return error response indicating an error occurred while following

@api_view(['GET']) # define decorator to allow only GET requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure only authenticated users can access this view
def get_users_posts(request, pk): # define a function get_users_posts to retrieve all posts of a user, takes request and pk (username) as arguments
    try: # start try block to handle errors safely
        user = MyUser.objects.get( # call get method to fetch target user's MyUser instance
            username=pk # pass username (pk) as argument to find the specific user
        )
        
        my_user = MyUser.objects.get( # call get method to fetch current authenticated user's MyUser instance
            username=request.user.username # pass authenticated user's username as argument
        )
    
    except MyUser.DoesNotExist: # handle case when either user does not exist
        return Response({'error': 'user does not exist'}) # return error response if user retrieval fails
    
    posts = user.posts.all().order_by('-created_at') # fetch all posts of target user and order them by creation date descending

    serializer = PostSerializer( # create PostSerializer instance to convert posts queryset to JSON
        posts, # pass posts queryset as argument
        many=True # specify many=True since multiple posts are serialized
    )

    data = [] # initialize empty list to store serialized posts with additional like status

    for post in serializer.data: # iterate through each serialized post dictionary
        new_post = {} # initialize empty dictionary to hold updated post data

        if my_user.username in post['likes']: # check if current user's username exists in post's likes list
            new_post = {**post, 'liked': True} # create new post dictionary including 'liked':True
        
        else: # if user has not liked the post
            new_post = {**post, 'liked': False} # create new post dictionary including 'liked':False
        
        data.append(new_post) # append updated post dictionary to data list

    return Response(data) # return response containing list of posts with like status
    
@api_view(['POST']) # define decorator to allow only POST requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure only authenticated users can access this view
def toggleLike(request): # define a function toggleLike to like or unlike a post, takes request as argument
    try: # start try block to handle errors during like toggle process
        try: # nested try block to fetch post instance from database
            post = Post.objects.get( # call get method on Post model to fetch target post
                id=request.data['id'] # pass post ID from request data to identify the post
            )
        
        except Post.DoesNotExist: # handle case when post does not exist
            return Response({'error': 'post does not exist'}) # return error response if post not found
        
        try: # nested try block to fetch current authenticated user
            user = MyUser.objects.get( # call get method on MyUser model to fetch current user
                username=request.user.username # pass authenticated user's username as argument
            )
        
        except MyUser.DoesNotExist: # handle case when authenticated user does not exist in database
            return Response({'error': 'user does not exist'}) # return error response if user not found
        
        if user in post.likes.all(): # check if current user has already liked the post
            post.likes.remove(user) # remove user from post's likes to unlike
            return Response({'now_liked': False}) # return response indicating post is now unliked
        
        else: # if user has not liked the post yet
            post.likes.add(user) # add user to post's likes to like the post
            return Response({'now_liked': True}) # return response indicating post is now liked
    
    except: # handle any unexpected errors during like toggle process
        return Response({'error': 'failed to like post'}) # return error response indicating failure to like/unlike post

@api_view(['POST']) # define decorator to allow only POST requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure only authenticated users can access this view
def create_post(request): # define a function create_post to create a new post, takes request as argument
    try: # start try block to handle errors during post creation
        data = request.data # extract data dictionary from request containing post details

        try: # nested try block to fetch current authenticated user
            user = MyUser.objects.get( # call get method on MyUser model to fetch current user instance
                username=request.user.username # pass authenticated user's username as argument
            )
        
        except MyUser.DoesNotExist: # handle case when authenticated user does not exist in database
            return Response({'error': 'user does not exist'}) # return error response if user not found
            
        post = Post.objects.create( # create a new Post instance and save it to database
            user=user, # assign current user as the author of the post
            description=data['description'] # assign post description from request data
        )

        serializer = PostSerializer( # create PostSerializer instance to convert newly created post to JSON
            post, # pass newly created post instance as argument
            many=False # specify many=False since a single post is being serialized
        )

        return Response(serializer.data) # return response containing serialized post data

    except: # handle any unexpected errors during post creation
        return Response({"error": "error creating post"}) # return error response indicating post creation failure

@api_view(['GET']) # define decorator to allow only GET requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure only authenticated users can access this view
def get_posts(request): # define a function get_posts to retrieve paginated posts with like status, takes request as argument
    try: # start try block to handle errors safely
        my_user = MyUser.objects.get( # call get method to fetch current authenticated user's MyUser instance
            username=request.user.username # pass authenticated user's username as argument
        )
    
    except MyUser.DoesNotExist: # handle case when authenticated user does not exist in database
        return Response({'error': 'user does not exist'}) # return error response if user not found

    posts = Post.objects.all().order_by('-created_at') # fetch all posts from database and order by creation date descending

    paginator = PageNumberPagination() # create PageNumberPagination instance to handle paginated response
    
    paginator.page_size = 10 # set number of posts per page to 10

    result_page = paginator.paginate_queryset( # paginate posts queryset based on request page number
        posts, # pass complete posts queryset
        request # pass request object to extract pagination parameters
    )
    
    serializer = PostSerializer( # create PostSerializer instance to convert paginated posts to JSON
        result_page, # pass paginated queryset
        many=True # specify many=True since multiple posts are serialized
    )

    data = [] # initialize empty list to store serialized posts with like status

    for post in serializer.data: # iterate through each serialized post dictionary
        new_post = {} # initialize empty dictionary to hold updated post data

        if my_user.username in post['likes']: # check if current user's username exists in post's likes list
            new_post = {**post, 'liked': True} # include 'liked':True if user liked the post
        
        else: # if user has not liked the post
            new_post = {**post, 'liked': False} # include 'liked':False
        
        data.append(new_post) # append updated post dictionary to data list

    return paginator.get_paginated_response(data) # return paginated response containing updated posts list

@api_view(['GET']) # define decorator to allow only GET requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure only authenticated users can access this view
def search_users(request): # define a function search_users to search users by username, takes request as argument
    query = request.query_params.get('query', '') # extract 'query' parameter from request URL, default to empty string
    
    users = MyUser.objects.filter( # call filter method on MyUser model to search users containing query substring
        username__icontains=query # use icontains lookup for case-insensitive partial match
    )
    
    serializer = UserSerializer( # create UserSerializer instance to convert queryset to JSON
        users, # pass queryset of matched users
        many=True # specify many=True since multiple user objects may match
    )
    
    return Response(serializer.data) # return response containing serialized user data

@api_view(['PATCH']) # define decorator to allow only PATCH requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure only authenticated users can access this view
def update_user_details(request): # define a function update_user_details to update current user's profile, takes request as argument
    data = request.data # extract incoming data dictionary from request containing fields to update

    try: # start try block to safely fetch current user
        user = MyUser.objects.get( # call get method to fetch authenticated user's MyUser instance
            username=request.user.username # pass authenticated user's username as argument
        )
    
    except MyUser.DoesNotExist: # handle case when authenticated user does not exist
        return Response({'error': 'user does not exist'}) # return error response if user not found
    
    serializer = UserSerializer( # create UserSerializer instance for partial update
        user, # pass current user instance as first argument
        data, # pass incoming data dictionary as second argument
        partial=True # enable partial update so only provided fields are updated
    )

    if serializer.is_valid(): # check if incoming data passes serializer validation
        serializer.save() # save validated data to update user instance
        return Response({**serializer.data, "success": True}) # return updated user data with success flag
    
    return Response({**serializer.errors, "success": False}) # return validation errors with success flag False

@api_view(['POST']) # define decorator to allow only POST requests for this view
@permission_classes([IsAuthenticated]) # define decorator to ensure only authenticated users can access this view
def logout(request): # define a function logout to log out the user by deleting JWT cookies, takes request as argument
    try: # start try block to handle errors safely
        res = Response() # create an empty Response object
        res.data = {"success": True} # assign success flag in response data
        res.delete_cookie('access_token', path='/', samesite='None') # delete 'access_token' cookie to invalidate session
        res.delete_cookie('refresh_token', path='/', samesite='None') # delete 'refresh_token' cookie to invalidate session
        return res # return response indicating successful logout

    except: # handle unexpected errors during logout
        return Response({"success": False}) # return response indicating logout failure