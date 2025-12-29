import uuid # import uuid to generate universally unique identifiers for primary keys
from django.conf import settings # import settings to access project-level configuration such as base website url
from django.db import models # import django models to define database-backed ORM models
from useraccount.models import User # import User model to establish ownership and relationships with properties and reservations

class Property(models.Model): # define a database model to represent a rentable property listing
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # define a non-editable UUID primary key to uniquely identify each property
    title = models.CharField(max_length=255) # store the property title to provide a short descriptive name
    description = models.TextField() # store a detailed textual description of the property
    price_per_night = models.IntegerField() # store the nightly rental price used for cost calculations
    bedrooms = models.IntegerField() # store the number of bedrooms to describe sleeping capacity
    bathrooms = models.IntegerField() # store the number of bathrooms for guest convenience details
    guests = models.IntegerField() # store the maximum number of guests allowed at the property
    country = models.CharField(max_length=255) # store the country name to indicate property location
    country_code = models.CharField(max_length=10) # store a short country code for filtering and localization
    category = models.CharField(max_length=255) # store the property category to support classification and search
    favorited = models.ManyToManyField(User, related_name="favorites", blank=True) # track users who have favorited the property for wishlist functionality
    image = models.ImageField(upload_to="uploads/properties") # store the main property image and upload it to a dedicated media directory
    landlord = models.ForeignKey(User, related_name="properties", on_delete=models.CASCADE) # associate the property with its owning landlord user
    created_at = models.DateTimeField(auto_now_add=True) # record the timestamp when the property was created

    def image_url( # define a helper method to return the full public url of the property image
        self, # reference the current property instance to access image data
    ):
        return f"{settings.WEBSITE_URL}{self.image.url}" # build and return an image url for client consumption

class Reservation(models.Model): # define a database model to represent a booking made for a property
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # define a non-editable UUID primary key to uniquely identify each reservation
    property = models.ForeignKey(Property, related_name="reservations", on_delete=models.CASCADE) # link the reservation to the booked property and cascade deletes
    start_date = models.DateField() # store the reservation start date to determine booking period
    end_date = models.DateField() # store the reservation end date to determine booking duration
    number_of_nights = models.IntegerField() # store the calculated number of nights for pricing and validation
    guests = models.IntegerField() # store the number of guests included in the reservation
    total_price = models.FloatField() # store the total calculated price for the reservation
    created_by = models.ForeignKey(User, related_name="reservations", on_delete=models.CASCADE) # associate the reservation with the user who made the booking
    created_at = models.DateTimeField(auto_now_add=True) # record the timestamp when the reservation was created