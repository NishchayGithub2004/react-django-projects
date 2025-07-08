from django.db import models # import 'models' framework to create classes that represent structure of table
from django.contrib.auth.models import User # import 'User' which is an in-built model to store user details (email and password)

class Note(models.Model): # create a class named 'Note' which extends class 'Model'
    title = models.CharField(max_length=100) # field/column named 'title' can store string of maximum 100 characters
    content = models.TextField() # field/column named 'content' can store string of unlimited characters
    created_at = models.DateTimeField(auto_now_add=True) # field/column named 'created_at' can store date and time of creation/insertion of data in table
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes") # create a one-to-many relationship between 'Note' and 'User' models
    # this means that one user can have multiple notes but each note belong to only one user
    # on_delete = models.CASCADE means that if a user is deleted, all notes created by that user will also be deleted
    # related_name = "notes" means that we can access all notes created by a user using the user.notes attribute

    # return value of 'title' of a row as it's unique identifier in string format
    def __str__(self):
        return self.title