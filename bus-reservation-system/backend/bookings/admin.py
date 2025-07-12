from django.contrib import admin # import admin to register models and customize their display in the admin interface
from .models import Bus, Seat, Booking # import the models

# Bus model is registered and the order in which they are displayed is specified using the list_display attribute in the BusAdmin class
class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_name', 'number', 'origin', 'destination', 'start_time', 'reach_time', 'no_of_seats', 'price')

# Seat model is registered and the order in which they are displayed is specified using the list_display attribute in the SeatAdmin class
class SeatAdmin(admin.ModelAdmin):
    list_display = ('seat_number', 'bus', 'is_booked')

# Booking model is registered and the order in which they are displayed is specified using the list_display attribute in the BookingAdmin class
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'bus', 'seat', 'booking_time', 'origin','price')

# register the models
admin.site.register(Bus, BusAdmin)
admin.site.register(Seat, SeatAdmin)
admin.site.register(Booking, BookingAdmin)