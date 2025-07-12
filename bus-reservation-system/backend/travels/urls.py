"""
URL configuration for travels project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path # include is used to include the urls of the app and path is used to define the urls
from django.contrib import admin # admin is used to create the admin page
from rest_framework.authtoken.views import obtain_auth_token # obtain_auth_token is used to obtain the authentication token for the user

urlpatterns = [
    path('admin/', admin.site.urls), # maps '/admin/' to the admin page
    path('api-token-auth/', obtain_auth_token), # maps '/api-token-auth/' to the obtain_auth_token view
    path('api/', include("bookings.urls")) # maps '/api/' to the bookings.urls
]