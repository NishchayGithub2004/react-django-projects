# import models 'User' and 'Note' and 'serializers' module to serialize data like JSON

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

# create a class 'UserSerializer' that inherits class 'ModelSerializer' from 'serializers' module
class UserSerializer(serializers.ModelSerializer):
    class Meta: # Meta class is used to provide metadata about the serializer
        model = User # 'User' model is to be serialized
        fields = ["id", "username", "password"] # 'id', 'username' and 'password' fields of 'User' model are to be serialized
        extra_kwargs = {"password": {"write_only": True}} # 'password' field is to be serialized in write-only mode ie it is not exposed in serialized format

    def create(self, validated_data): # create a custom method 'create' that takes 'validated_data' as an argument
        print(validated_data) # print the data that is passed to the method
        user = User.objects.create_user(**validated_data) # create a new user with the data that is passed to the method ('**' unpacks data given in dictionary form)
        # this means if 'validated_data' is given as ("name": "John", "age": 30), then 'create_user' method will create a new user with name "John" and age 30
        return user # return the user object which is newly added row

# create a class 'NoteSerializer' that inherits class 'ModelSerializer' from'serializers' module
class NoteSerializer(serializers.ModelSerializer):
    class Meta: # Meta class is used to provide metadata about the serializer
        model = Note # 'Note' model is to be serialized
        fields = ["id", "title", "content", "created_at", "author"] # 'id', 'title', 'content', 'created_at' and 'author' fields of 'Note' model are to be serialized
        extra_kwargs = {"author": {"read_only": True}} # # 'author' field is to be serialized in read-only mode ie it is not exposed in serialized format