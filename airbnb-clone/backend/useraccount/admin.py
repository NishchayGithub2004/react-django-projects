from django.contrib import admin # import django admin module to enable model registration for administrative access
from .models import User # import User model to expose user records in the admin interface

admin.site.register(User) # register the User model to allow admin users to manage application users