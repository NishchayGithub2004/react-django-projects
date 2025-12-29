from rest_framework import serializers # import serializers to convert model instances into json-compatible representations
from .models import User # import User model to define which database model this serializer represents

class UserDetailSerializer(serializers.ModelSerializer): # define a serializer to expose selected user fields in api responses
    class Meta: # define metadata configuration for the serializer
        model = User # specify the User model as the source of serialized data
        fields = ( # declare an explicit tuple of fields to control what user data is exposed
            "id", # include the unique user identifier to reference the user externally
            "name", # include the user's display name for identification in client applications
            "avatar_url" # include the computed avatar url to allow clients to load the profile image
        )