from django.contrib.auth.models import User # import 'Users' model
from rest_framework import generics # import generics which contains pre-built views for tasks like list, create, update, delete etc.
from .serializers import UserSerializer, NoteSerializer # import serializers
from rest_framework.permissions import IsAuthenticated, AllowAny # import 'IsAuthenticated' which checks if the user is authenticated or not and 'AllowAny' which allows any user to access the view
from .models import Note # import 'Note' model

# create a class 'NotesListCreate' that will act as an API view for listing and creating notes, it inherits 'ListCreateAPIView' from 'generics'
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer # tell the view which serializer to use
    
    permission_classes = [IsAuthenticated] # restrict permissions to authenticated users only

    # define a method 'get_queryset' which takes current user and returns all notes associated with that user
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    # define a method 'perform_create' which takes the serializer and serializes the note associated with current user if the serializer is valid, otherwise print errors related to the serializer
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

# create a class 'NoteDelete' that will act as an API to delete notes, it inherits 'DestroyAPIView' from 'generics'
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer # tell the view which serializer to use
    
    permission_classes = [IsAuthenticated] # restrict permissions to authenticated users only

    # define a method 'get_queryset' which takes current user and returns all notes associated with that user
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

# create a class 'CreateUserView' that will act as an API view for creating users, it inherits 'CreateAPIView' from 'generics'
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all() # get content of 'User' model
    serializer_class = UserSerializer # tell the view which serializer to use
    permission_classes = [AllowAny] # allow any user to access the view