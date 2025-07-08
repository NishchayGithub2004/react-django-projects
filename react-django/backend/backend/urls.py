"""
URL configuration for backend project.

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
from django.contrib import admin # import in-built admin interface to manage database models
from django.urls import path, include # import path and include functions for URL routing
from api.views import CreateUserView # import 'CreateUserView'
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView # import 'TokenObtainPairView' to and 'TokenRefreshView'
# 'TokenObtainPairView' is used to obtain a pair of access and refresh tokens when a user logs in with valid credentials
# 'TokenRefreshView' is used to obtain a new pair of access and refresh tokens when the current access token has expired without re-logging in
# access token is used to authenticate the user and access protected resources and refresh token is used to obtain a new access token without re-logging in

urlpatterns = [
    path("admin/", admin.site.urls), # route for Django Admin panel (/admin/)
    path("api/user/register/", CreateUserView.as_view(), name="register"), # route to register a new user via POST (/api/user/register/)
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"), # route to get JWT access and refresh tokens by sending username and password
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"), # route to get a new access token using the refresh token
    path("api-auth/", include("rest_framework.urls")), # adds login/logout UI for browsable API (mostly for development use)
    path("api/", include("api.urls")), # includes all URLs from your app’s api/urls.py
]