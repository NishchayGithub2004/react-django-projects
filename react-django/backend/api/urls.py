from django.urls import path # import 'path' function to define URL patterns
from . import views # import 'views.py' from current directory

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"), # define a URL route for '/notes/' that is connected to 'NoteListCreate' view
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"), # define a URL route for '/notes/delete/<int:pk>/' 
    # that is connected to 'NoteDelete' view where 'pk' is an integer that denotes dynamic URL
]