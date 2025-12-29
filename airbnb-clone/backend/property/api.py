from django.http import JsonResponse # import JsonResponse to return structured json responses from api views
from rest_framework.decorators import api_view, authentication_classes, permission_classes # import decorators to control http methods and authentication behavior
from rest_framework_simplejwt.tokens import AccessToken # import AccessToken to manually decode jwt tokens from request headers
from .forms import PropertyForm # import PropertyForm to validate and process property-related input data
from .models import Property, Reservation # import Property and Reservation models to query listings and bookings
from .serializers import PropertiesListSerializer, PropertiesDetailSerializer, ReservationsListSerializer # import serializers to shape property and reservation response data
from useraccount.models import User # import User model to resolve authenticated users and favorites

@api_view(["GET"]) # restrict this endpoint to handle only get requests
@authentication_classes([]) # disable default authentication to allow public access with optional token parsing
@permission_classes([]) # disable permission checks to support anonymous property browsing
def properties_list( # define an api view to return a filtered list of available properties
    request, # receive the request object to access query parameters and headers
):
    try: # attempt to resolve an authenticated user from the authorization header if present
        token = request.META["HTTP_AUTHORIZATION"].split("Bearer ")[1] # extract the raw jwt token from the authorization header
        token = AccessToken(token) # decode and validate the jwt token to access its payload
        user_id = token.payload["user_id"] # extract the user id claim from the token payload
        user = User.objects.get(pk=user_id) # retrieve the authenticated user instance from the database
    
    except Exception: # handle missing or invalid tokens gracefully
        user = None # treat the request as anonymous if authentication fails

    favorites = [] # initialize a list to track property ids favorited by the authenticated user
    
    properties = Property.objects.all() # start with all properties as the base queryset
    
    # extract the following filters from query parameters to narrow property search results based on user-selected criteria
    is_favorites = request.GET.get("is_favorites", "") # flag indicating whether only favorited properties should be returned
    landlord_id = request.GET.get("landlord_id", "") # identifier of a landlord to restrict results to properties owned by a specific user
    country = request.GET.get("country", "") # country value to limit results to properties located in a specific country
    category = request.GET.get("category", "") # category value to filter properties by type or classification
    checkin_date = request.GET.get("checkIn", "") # check-in date used to exclude properties that are unavailable during the requested period
    checkout_date = request.GET.get("checkOut", "") # check-out date used alongside check-in to determine booking overlaps
    bedrooms = request.GET.get("numBedrooms", "") # minimum number of bedrooms required to satisfy accommodation needs
    guests = request.GET.get("numGuests", "") # minimum guest capacity required to ensure sufficient space
    bathrooms = request.GET.get("numBathrooms", "") # minimum number of bathrooms required to match comfort expectations

    print("country", country) # log the selected country filter for debugging and inspection

    if checkin_date and checkout_date: # apply availability filtering only when both dates are provided
        exact_matches = Reservation.objects.filter(start_date=checkin_date) | Reservation.objects.filter(end_date=checkout_date) # find reservations that start or end exactly on requested dates
        
        overlap_matches = Reservation.objects.filter(start_date__lte=checkout_date, end_date__gte=checkin_date) # find reservations that overlap the requested date range
        
        all_matches = [] # initialize a list to collect property ids that are unavailable

        for reservation in exact_matches | overlap_matches: # iterate through all conflicting reservations
            all_matches.append(reservation.property_id) # collect property ids that should be excluded
        
        properties = properties.exclude(id__in=all_matches) # exclude unavailable properties from the results

    if landlord_id: # apply landlord filtering when a landlord id is provided
        properties = properties.filter(landlord_id=landlord_id) # restrict results to properties owned by the specified landlord

    if is_favorites: # apply favorites filter when requested
        properties = properties.filter(favorited__in=[user]) # restrict results to properties favorited by the authenticated user
    
    if guests: # apply guest capacity filter when provided
        properties = properties.filter(guests__gte=guests) # restrict results to properties that can host at least the given number of guests
    
    if bedrooms: # apply bedroom count filter when provided
        properties = properties.filter(bedrooms__gte=bedrooms) # restrict results to properties meeting the minimum bedroom requirement
    
    if bathrooms: # apply bathroom count filter when provided
        properties = properties.filter(bathrooms__gte=bathrooms) # restrict results to properties meeting the minimum bathroom requirement
    
    if country: # apply country filter when provided
        properties = properties.filter(country=country) # restrict results to properties located in the specified country
    
    if category and category != "undefined": # apply category filter only when a valid category is selected
        properties = properties.filter(category=category) # restrict results to properties in the selected category
    
    if user: # determine favorite properties only when the user is authenticated
        for property in properties: # iterate through filtered properties
            if user in property.favorited.all(): # check whether the property is favorited by the user
                favorites.append(property.id) # add the property id to the favorites list

    serializer = PropertiesListSerializer(properties, many=True) # serialize the final filtered property queryset

    return JsonResponse( # return the serialized property data along with favorite metadata
        {
            "data": serializer.data, # include serialized property list for client rendering
            "favorites": favorites # include list of property ids favorited by the authenticated user
        }
    )

@api_view(["GET"]) # restrict this endpoint to handle only get requests
@authentication_classes([]) # disable authentication to allow public access to property details
@permission_classes([]) # disable permission checks for unauthenticated property viewing
def properties_detail( # define an api view to return detailed information for a single property
    request, # receive the request object to process the incoming http call
    pk, # receive the primary key of the property to retrieve
):
    property = Property.objects.get(pk=pk) # retrieve the property instance by its unique identifier

    serializer = PropertiesDetailSerializer(property, many=False) # serialize the property instance into a detailed json representation

    return JsonResponse(serializer.data) # return the serialized property data as a json response

@api_view(["GET"]) # restrict this endpoint to handle only get requests
@authentication_classes([]) # disable authentication to allow public access to property reservations
@permission_classes([]) # disable permission checks to expose reservation data publicly
def property_reservations( # define an api view to list all reservations for a specific property
    request, # receive the request object to process the incoming http call
    pk, # receive the primary key of the property whose reservations are requested
):
    property = Property.objects.get(pk=pk) # retrieve the property instance by its unique identifier
    
    reservations = property.reservations.all() # fetch all reservation records associated with the property

    serializer = ReservationsListSerializer(reservations, many=True) # serialize the reservation queryset into a json-friendly format

    return JsonResponse(serializer.data, safe=False) # return the serialized reservations list as a json array response

@api_view(["POST", "FILES"]) # restrict this endpoint to handle property creation with file uploads
def create_property( # define an api view to create a new property listing
    request, # receive the request object containing form data and uploaded files
):
    form = PropertyForm(request.POST, request.FILES) # bind incoming request data to the property form for validation

    if form.is_valid(): # check whether the submitted form data passes validation rules
        property = form.save(commit=False) # create a property instance without saving to assign additional fields
        property.landlord = request.user # assign the authenticated user as the landlord owning the property
        property.save() # persist the property instance to the database

        return JsonResponse({"success": True}) # return a success response indicating property creation completed
    else:
        print("error", form.errors, form.non_field_errors) # log form validation errors for debugging purposes
        return JsonResponse({"errors": form.errors.as_json()}, status=400) # return validation errors with a bad request status

@api_view(["POST"]) # restrict this endpoint to handle only post requests
def book_property( # define an api view to create a reservation for a property
    request, # receive the request object containing booking details
    pk, # receive the primary key of the property being booked
):
    try: # wrap booking logic in a try block to handle unexpected failures
        start_date = request.POST.get("start_date", "") # extract the reservation start date from the request payload
        end_date = request.POST.get("end_date", "") # extract the reservation end date from the request payload
        number_of_nights = request.POST.get("number_of_nights", "") # extract the total number of nights for the booking
        total_price = request.POST.get("total_price", "") # extract the total calculated booking price
        guests = request.POST.get("guests", "") # extract the number of guests included in the booking

        property = Property.objects.get(pk=pk) # retrieve the property instance being booked

        Reservation.objects.create( # create a new reservation record in the database
            property=property, # associate the reservation with the selected property
            start_date=start_date, # store the booking start date
            end_date=end_date, # store the booking end date
            number_of_nights=number_of_nights, # store the total number of nights
            total_price=total_price, # store the total booking price
            guests=guests, # store the number of guests for the reservation
            created_by=request.user # associate the reservation with the authenticated user
        )

        return JsonResponse({"success": True}) # return a success response indicating booking completion
    except Exception as e: # catch any exception raised during the booking process
        print("Error", e) # log the exception details for debugging

        return JsonResponse({"success": False}) # return a failure response to the client

@api_view(["POST"]) # restrict this endpoint to handle only post requests
def toggle_favorite( # define an api view to toggle favorite status for a property
    request, # receive the request object to identify the authenticated user
    pk, # receive the primary key of the property to toggle
):
    property = Property.objects.get(pk=pk) # retrieve the property instance by its unique identifier

    if request.user in property.favorited.all(): # check whether the property is already favorited by the user
        property.favorited.remove(request.user) # remove the user from the property's favorites relationship
        return JsonResponse({"is_favorite": False}) # return a response indicating the property is no longer a favorite
    
    else:
        property.favorited.add(request.user) # add the user to the property's favorites relationship
        return JsonResponse({"is_favorite": True}) # return a response indicating the property is now a favorite