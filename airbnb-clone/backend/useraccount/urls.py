from django.urls import path # import path to define url routing patterns for authentication and user-related endpoints
from dj_rest_auth.jwt_auth import get_refresh_view # import jwt refresh view factory to issue new access tokens
from dj_rest_auth.registration.views import RegisterView # import registration view to handle new user sign-ups
from dj_rest_auth.views import LoginView, LogoutView # import login and logout views to manage user authentication sessions
from . import api # import api module to reference custom user-related api view functions

urlpatterns = [ # define a list of url patterns for authentication and user account endpoints
    path("register/", RegisterView.as_view(), name="rest_register"), # expose an endpoint to allow users to register new accounts
    path("login/", LoginView.as_view(), name="rest_login"), # expose an endpoint to authenticate users and issue tokens
    path("logout/", LogoutView.as_view(), name="rest_logout"), # expose an endpoint to invalidate the current user session
    path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"), # expose an endpoint to refresh expired access tokens using a refresh token
    path("myreservations/", api.reservations_list, name="api_reservations_list"), # map endpoint to return reservations belonging to the authenticated user
    path("<uuid:pk>/", api.landlord_detail, name="api_landlrod_detail"), # map endpoint to return public details of a landlord by user id
]