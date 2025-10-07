from django.db import models # import models module from django.db to create and manage database models
from django.contrib.auth.models import AbstractUser # import AbstractUser class to extend Django's built-in user model

class MyUser(AbstractUser): # define a class MyUser to create a custom user model inheriting from AbstractUser
    username = models.CharField( # create a CharField for username to store short string values
        max_length=50, # set maximum allowed length for username as 50 characters
        unique=True, # ensure each username is unique in the database
        primary_key=True # make username the primary key for user identification
    )
    
    bio = models.CharField( # create a CharField for bio to store user's description
        max_length=500 # set maximum allowed length for bio as 500 characters
    )
    
    profile_image = models.ImageField( # create an ImageField to store user's profile picture
        upload_to='profile_image/', # set directory path where uploaded images will be saved
        blank=True, # allow this field to be left empty in forms
        null=True # allow this field to store null values in the database
    )
    
    followers = models.ManyToManyField( # create a ManyToManyField to store user’s followers
        'self', # set relation to self to allow users to follow other users
        symmetrical=False, # make relationship non-symmetrical since following isn’t mutual automatically
        related_name='following', # assign reverse relation name for users being followed
        blank=True # allow field to be empty if user has no followers
    )

    def __str__(self): # define a method __str__ to return string representation of MyUser object
        return self.username # return username to represent user object as readable text

class Post(models.Model): # define a class Post to represent user's posts
    user = models.ForeignKey( # create a ForeignKey relation between Post and MyUser
        MyUser, # specify related model MyUser as the foreign key reference
        on_delete=models.CASCADE, # delete all posts when the related user is deleted
        related_name='posts' # assign reverse relation name 'posts' to access user's posts
    )
    
    description = models.CharField( # create a CharField to store post description text
        max_length=400 # set maximum allowed length for description as 400 characters
    )
    
    created_at = models.DateTimeField( # create a DateTimeField to store post creation timestamp
        auto_now_add=True # automatically set current date/time when post is created
    )
    
    likes = models.ManyToManyField( # create a ManyToManyField to track which users liked the post
        MyUser, # specify MyUser as related model for like relationship
        related_name='post_likes', # assign reverse relation name 'post_likes' to access liked posts from user
        blank=True # allow field to remain empty if no one liked the post
    )