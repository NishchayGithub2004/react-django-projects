from django.db import models # import 'models' to define database models
from django.contrib.auth.models import User # import 'User' model which is in-built user authentication model that contains fields like username, email, password, etc.

# Create your models here.

# create a model 'Bus' that inherits from 'models.Model' for model creation and contains the following fields
class Bus(models.Model):
    bus_name = models.CharField(max_length=100) # bus_name is a character field with a maximum length of 100 characters
    number = models.CharField(max_length=20, unique=True) # number is a character field with a maximum length of 20 characters and always has unique values
    origin = models.CharField(max_length=50) # origin is a character field with a maximum length of 50 characters
    destination = models.CharField(max_length=50) # destination is a character field with a maximum length of 50 characters
    features = models.TextField() # features is a text field with no maximum length
    start_time = models.TimeField() # start_time is a time field in 12:00:00 format
    reach_time = models.TimeField() # reach_time is a time field in 12:00:00 format
    no_of_seats = models.PositiveBigIntegerField() # no_of_seats is a positive integer field
    price = models.DecimalField(max_digits=8, decimal_places=2) # price is a decimal field with a maximum of 8 digits and 2 decimal places

    # define a string representation of the model instance
    def __str__(self):
        return f"{self.bus_name} {self.number}"

# create a model 'Seat' that inherits from'models.Model' for model creation and contains the following fields
class Seat(models.Model):
    bus = models.ForeignKey('Bus', on_delete=models.CASCADE, related_name='seats') # bus is a foreign key field that references the 'Bus' model and deletes all associated 'Seat' instances when the referenced 'Bus' instance is deleted
    seat_number = models.CharField(max_length=10) # seat_number is a character field with a maximum length of 10 characters
    is_booked = models.BooleanField(default=False) # is_booked is a boolean field with a default value of False

    # define a string representation of the model instance
    def __str__(self):
        return f"{self.seat_number}"

# create a model 'Booking' that inherits from'models.Model' for model creation and contains the following fields
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # user is a foreign key field that references the 'User' model and deletes all associated 'Booking' instances when the referenced 'User' instance is deleted
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE) # bus is a foreign key field that references the 'Bus' model and deletes all associated 'Booking' instances when the referenced 'Bus' instance is deleted
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE) # seat is a foreign key field that references the 'Seat' model and deletes all associated 'Booking' instances when the referenced 'Seat' instance is deleted
    booking_time = models.DateTimeField(auto_now_add=True) # booking_time is a datetime field that automatically sets the current date and time when a new 'Booking' instance is created

    # define a string representation of the model instance
    def __str__(self):
        return f"{self.user.username}-{self.bus.bus_name}-{self.bus.start_time}-{self.bus.reach_time}-{self.seat.seat_number}"
    
    # define properties called 'price', 'origin', and 'destination' that return the corresponding values from the referenced 'Bus' instance
    @property
    def price(self):
        return self.bus.price
    @property
    def origin(self):
        return self.bus.origin
    @property
    def destination(self):
        return self.bus.destination