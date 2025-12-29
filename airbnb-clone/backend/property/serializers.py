from rest_framework import serializers # import serializers to convert model instances into json-compatible api representations
from .models import Property, Reservation # import property and reservation models to define serializer data sources
from useraccount.serializers import UserDetailSerializer # import user detail serializer to nest landlord data in responses

class PropertiesListSerializer(serializers.ModelSerializer): # define a serializer to represent property summaries in list views
    class Meta: # define metadata configuration for the properties list serializer
        model = Property # specify the Property model as the source of serialized data
        fields = ( # declare a limited set of fields for lightweight property listing responses
            "id", # include the unique property identifier for navigation and referencing
            "title", # include the property title for display in listings
            "price_per_night", # include nightly price to show cost at a glance
            "image_url", # include computed image url to allow clients to render property images
        )

class PropertiesDetailSerializer(serializers.ModelSerializer): # define a serializer to represent detailed property information
    landlord = UserDetailSerializer(read_only=True, many=False) # serialize landlord details while preventing client-side modification

    class Meta: # define metadata configuration for the property detail serializer
        model = Property # specify the Property model as the source of serialized data
        fields = ( # declare all fields required to render a full property detail page
            "id", # include the unique property identifier
            "title", # include the property title for identification
            "description", # include the full property description for detailed viewing
            "price_per_night", # include nightly price for booking calculations
            "image_url", # include computed image url to display the main property image
            "bedrooms", # include bedroom count to describe sleeping capacity
            "bathrooms", # include bathroom count to describe amenities
            "guests", # include maximum guest capacity for booking validation
            "landlord" # include landlord details to show property ownership information
        )

class ReservationsListSerializer(serializers.ModelSerializer): # define a serializer to represent reservation records
    property = PropertiesListSerializer(read_only=True, many=False) # nest a lightweight property serializer to show booked property details
    
    class Meta: # define metadata configuration for the reservations list serializer
        model = Reservation # specify the Reservation model as the source of serialized data
        fields = ( # declare fields required to display reservation history and details
            "id", # include the unique reservation identifier
            "start_date", # include the reservation start date to show booking period
            "end_date", # include the reservation end date to show booking duration
            "number_of_nights", # include calculated nights to explain pricing
            "total_price", # include total price charged for the reservation
            "property" # include nested property data to identify what was booked
        )