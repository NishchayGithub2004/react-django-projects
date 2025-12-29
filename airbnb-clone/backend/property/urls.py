from django.urls import path # import path to define url routing patterns for property-related api endpoints
from . import api # import api module to reference property-related view functions

urlpatterns = [ # define a list of url patterns for property api endpoints
    path("", api.properties_list, name="api_properties_list"), # map root endpoint to return a list of available properties
    path("create/", api.create_property, name="api_create_property"), # map endpoint to handle creation of new property listings
    path("<uuid:pk>/", api.properties_detail, name="api_properties_detail"), # map endpoint to retrieve detailed information for a specific property
    path("<uuid:pk>/book/", api.book_property, name="api_book_property"), # map endpoint to create a reservation for a specific property
    path("<uuid:pk>/reservations/", api.property_reservations, name="api_property_reservations"), # map endpoint to list all reservations for a specific property
    path("<uuid:pk>/toggle_favorite/", api.toggle_favorite, name="api_toggle_favorite"), # map endpoint to toggle favorite status of a property for the authenticated user
]