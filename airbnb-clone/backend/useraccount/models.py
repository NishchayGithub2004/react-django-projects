import uuid # import uuid to generate universally unique identifiers for user primary keys

from django.conf import settings # import settings to access project-level configuration values such as base website url
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager # import authentication base classes and manager utilities to build a custom user model
from django.db import models # import django models to define database-backed ORM models

class CustomUserManager(UserManager): # define a custom user manager to control how user instances are created
    def _create_user( # define a private helper method to centralize user creation logic
        self, # reference the manager instance to access model and database context
        name, # accept the user's display name to store personal identification
        email, # accept the user's email address to use as the unique login identifier
        password, # accept the raw password to be hashed and stored securely
        **extra_fields, # accept additional keyword arguments for extensibility of user attributes
    ):
        if not email: # validate that an email address was provided to enforce authentication requirements
            raise ValueError("You have not specified a valid e-mail address") # raise an explicit error to prevent invalid user creation
    
        email = self.normalize_email(email) # normalize the email address to enforce consistent casing and formatting
        user = self.model(email=email, name=name, **extra_fields) # instantiate a user model instance with provided core and extra fields
        user.set_password(password) # hash and set the user's password securely instead of storing it in plain text
        user.save(using=self.db) # persist the user instance to the configured database

        return user # return the newly created user instance for further use

    def create_user( # define a public method to create a regular non-admin user
        self, # reference the manager instance to delegate creation logic
        name=None, # accept an optional name for flexibility during user registration
        email=None, # accept an optional email to allow validation before persistence
        password=None, # accept an optional password to support deferred password setting
        **extra_fields, # accept additional attributes to customize the user instance
    ):
        extra_fields.setdefault("is_staff", False) # ensure regular users do not have staff-level access by default
        extra_fields.setdefault("is_superuser", False) # ensure regular users do not have superuser privileges
        return self._create_user(name, email, password, **extra_fields) # delegate actual creation to the shared helper method
    
    def create_superuser( # define a public method to create an administrative superuser
        self, # reference the manager instance to reuse creation logic
        name=None, # accept an optional name for the superuser account
        email=None, # accept an optional email to serve as the login identifier
        password=None, # accept an optional password for administrative access
        **extra_fields, # accept additional attributes to configure superuser properties
    ):
        extra_fields.setdefault("is_staff", True) # grant staff privileges required for admin interface access
        extra_fields.setdefault("is_superuser", True) # grant full superuser permissions for unrestricted control
        return self._create_user(name, email, password, **extra_fields) # delegate creation to the shared helper method

class User(AbstractBaseUser, PermissionsMixin): # define a custom user model to replace Django's default user
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # define a non-editable UUID primary key to uniquely identify each user
    email = models.EmailField(unique=True) # store a unique email address to serve as the authentication identifier
    name = models.CharField(max_length=255, blank=True, null=True) # store an optional display name for user-friendly identification
    avatar = models.ImageField(upload_to="uploads/avatars") # store a user profile image and upload it to a dedicated media directory

    is_active = models.BooleanField(default=True) # indicate whether the user account is active and allowed to authenticate
    is_superuser = models.BooleanField(default=False) # indicate whether the user has unrestricted system-level permissions
    is_staff = models.BooleanField(default=False) # indicate whether the user can access staff-only areas like the admin panel

    date_joined = models.DateTimeField(auto_now_add=True) # record the timestamp when the user account was created
    last_login = models.DateTimeField(blank=True, null=True) # store the timestamp of the user's most recent authentication

    objects = CustomUserManager() # attach the custom user manager to control user creation behavior

    USERNAME_FIELD = "email" # configure email as the unique identifier used for authentication
    EMAIL_FIELD = "email" # specify the field used for email communications
    REQUIRED_FIELDS = ["name"] # define additional required fields when creating superusers via the command line

    def avatar_url( # define a helper method to return a fully qualified avatar image url
        self, # reference the current user instance to access avatar data
    ):
        if self.avatar: # check whether the user has uploaded an avatar image
            return f"{settings.WEBSITE_URL}{self.avatar.url}" # build and return the absolute url for external access
        else:
            return "" # return an empty string when no avatar is available to avoid broken links