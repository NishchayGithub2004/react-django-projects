from django.forms import ModelForm # import ModelForm to automatically generate a form based on a django model
from .models import Property # import Property model to bind the form fields to property database attributes

class PropertyForm(ModelForm): # define a form class to handle creation and editing of property records
    class Meta: # define metadata to configure how the form maps to the model
        model = Property # specify the Property model as the source of form fields
        fields = ( # explicitly list allowed fields to control which attributes can be set via the form
            "title", # include the property title to capture a short descriptive name
            "description", # include the property description to capture detailed listing information
            "price_per_night", # include nightly price to support booking cost calculations
            "bedrooms", # include bedroom count to describe sleeping capacity
            "bathrooms", # include bathroom count to describe amenities
            "guests", # include maximum guest count to enforce booking limits
            "country", # include country name to record property location
            "country_code", # include country code to support localization and filtering
            "category", # include category to classify the property type
            "image", # include image field to allow uploading a primary property photo
        )