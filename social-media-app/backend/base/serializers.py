from rest_framework import serializers # import serializers module to define and manage model serializers
from .models import MyUser, Post # import MyUser and Post models to create serializers for them

class UserRegisterSerializer(serializers.ModelSerializer): # define a class UserRegisterSerializer to serialize and validate data for new user registration
    password = serializers.CharField( # create a CharField for password to capture password input
        write_only=True # set write_only to True so password is used only for input and not exposed in output
    )

    class Meta: # define an inner Meta class to specify model and fields for serialization
        model = MyUser # assign MyUser model to be serialized
        fields = ['username', 'email', 'first_name', 'last_name', 'password'] # specify fields to include in serialization

    def create(self, validated_data): # define a method create to handle user creation with validated data, takes validated_data as argument
        user = MyUser( # create a new MyUser instance with validated data
            username=validated_data['username'], # assign username value from validated data
            email=validated_data['email'], # assign email value from validated data
            first_name=validated_data['first_name'], # assign first_name value from validated data
            last_name=validated_data['last_name'] # assign last_name value from validated data
        )
        user.set_password( # call set_password method to hash and securely set the password
            validated_data['password'] # pass raw password from validated data as argument
        )
        user.save() # save new user instance to database
        return user # return created user instance

class MyUserProfileSerializer(serializers.ModelSerializer): # define a class MyUserProfileSerializer to serialize user profile data
    follower_count = serializers.SerializerMethodField() # define SerializerMethodField to compute number of followers dynamically
    following_count = serializers.SerializerMethodField() # define SerializerMethodField to compute number of users the person follows dynamically

    class Meta: # define an inner Meta class to specify model and fields
        model = MyUser # assign MyUser model to be serialized
        fields = ['username', 'bio', 'profile_image', 'follower_count', 'following_count'] # specify fields to include in serialized data

    def get_follower_count(self, obj): # define a method get_follower_count to return number of followers, takes obj (user instance) as argument
        return obj.followers.count() # return count of related follower users

    def get_following_count(self, obj): # define a method get_following_count to return number of users being followed, takes obj (user instance) as argument
        return obj.following.count() # return count of related following users

class PostSerializer(serializers.ModelSerializer): # define a class PostSerializer to serialize post data
    username = serializers.SerializerMethodField() # define SerializerMethodField to get username of post creator
    like_count = serializers.SerializerMethodField() # define SerializerMethodField to calculate number of likes for post
    formatted_date = serializers.SerializerMethodField() # define SerializerMethodField to format post creation date

    class Meta: # define an inner Meta class to specify model and fields
        model = Post # assign Post model to be serialized
        fields = ['id', 'username', 'description', 'formatted_date', 'likes', 'like_count'] # specify fields to include in serialized data

    def get_username(self, obj): # define a method get_username to retrieve post creator's username, takes obj (post instance) as argument
        return obj.user.username # return username of user associated with the post

    def get_like_count(self, obj): # define a method get_like_count to calculate number of likes, takes obj (post instance) as argument
        return obj.likes.count() # return count of users who liked the post

    def get_formatted_date(self, obj): # define a method get_formatted_date to format creation date, takes obj (post instance) as argument
        return obj.created_at.strftime("%d %b %y") # return formatted date string in 'day month year' format

class UserSerializer(serializers.ModelSerializer): # define a class UserSerializer to serialize general user data
    class Meta: # define an inner Meta class to specify model and fields
        model = MyUser # assign MyUser model to be serialized
        fields = ['username', 'bio', 'email', 'profile_image', 'first_name', 'last_name'] # specify user fields to include in serialized data
