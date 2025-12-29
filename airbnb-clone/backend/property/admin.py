from django.contrib import admin # import django admin module to register models for management through the admin interface
from .models import Property, Reservation # import property-related models to expose them in the admin panel

admin.site.register(Property) # register the Property model to allow admin users to manage property listings
admin.site.register(Reservation) # register the Reservation model to allow admin users to manage booking records