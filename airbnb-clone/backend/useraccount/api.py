from django.http import JsonResponse # import JsonResponse to return structured json responses from api views
from rest_framework.decorators import api_view, authentication_classes, permission_classes # import decorators to define request methods and override auth behavior
from .models import User # import User model to retrieve landlord and authenticated user data
from .serializers import UserDetailSerializer # import serializer to expose selected user details in responses
from property.serializers import ReservationsListSerializer # import reservation serializer to represent booking data for users

@api_view(["GET"]) # restrict this endpoint to handle only get requests
@authentication_classes([]) # disable authentication to allow public access to landlord details
@permission_classes([]) # disable permission checks to expose landlord data without restrictions
def landlord_detail( # define an api view to return public details of a landlord user
    request, # receive the request object without requiring authentication
    pk, # receive the primary key of the landlord user to retrieve
):
    user = User.objects.get(pk=pk) # retrieve the landlord user instance by primary key
    serializer = UserDetailSerializer(user, many=False) # serialize the landlord user data into a json-friendly format
    return JsonResponse(serializer.data, safe=False) # return the serialized user data as a json response

@api_view(["GET"]) # restrict this endpoint to handle only get requests
def reservations_list( # define an api view to return reservations for the authenticated user
    request, # receive the request object to access the authenticated user context
):
    reservations = request.user.reservations.all() # retrieve all reservations created by the authenticated user
    print("user", request.user) # output the authenticated user to the server log for debugging purposes
    print(reservations) # output the reservations queryset to the server log for debugging and inspection
    serializer = ReservationsListSerializer(reservations, many=True) # serialize the reservations queryset into a json-friendly structure
    return JsonResponse(serializer.data, safe=False) # return the serialized reservations list as a json array response