from rest_framework import serializers # import serializers module from rest_framework to serialize the data
from .models import Bus, Seat, Booking # import models from models.py
from django.contrib.auth.models import User  # import User model that contains user authentication related fields like username, email, password, etc.

# create a serializer named 'UserRegisterSerializer' that inherits from 'ModelSerializer' class
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True) # create a field named 'password' that will be used to store the password of the user
    # write_only = True means that the password field will not be returned in the response

    # create a Meta class that defines the model and it's rows to serialize
    class Meta:
        model = User # User model will be serialized by this seializer
        fields = ['username', 'email', 'password'] # 'username', 'email', 'password' fields will be serialized by this serializer

    # create a function that takes validated data and creates a new instance in 'User' model and return it
    def create(self, validate_data):
        user = User.objects.create_user(
            username = validate_data['username'],
            email = validate_data['email'],
            password= validate_data['password']
        )

        return user

# create a serializer named 'SeatSerializer' that inherits from 'ModelSerializer' class
class SeatSerializer(serializers.ModelSerializer):
    # create a Meta class that defines the model and it's rows to serialize
    class Meta:
        model = Seat # Seat model will be serialized by this seializer
        fields = ['id','seat_number', 'is_booked'] # 'id','seat_number', 'is_booked' fields will be serialized by this serializer

# create a serializer named 'BusSerializer' that inherits from 'ModelSerializer' class
class BusSerializer(serializers.ModelSerializer):
    seats = SeatSerializer(many=True, read_only=True) # create an instance of 'SeatSerializer' class that can take a list of seats and return it in a read only form

    # create a Meta class that defines the model and it's rows to serialize
    class Meta:
        model = Bus
        fields = '__all__'

class BusSummarySerializer(serializers.ModelSerializer):
    # create a Meta class that defines the model and it's rows to serialize
    class Meta:
        model = Bus
        fields = ['bus_name', 'number', 'origin', 'destination']

# create a serializer named 'BookingSerializer' that inherits from 'ModelSerializer' class
class BookingSerializer(serializers.ModelSerializer):
    bus = BusSummarySerializer(read_only=True) # create an instance of 'BusSummarySerializer' class that can be read only
    seat = SeatSerializer(read_only=True) # create an instance of 'SeatSerializer' class that can be read only
    user = serializers.StringRelatedField() # create a field named 'user' that will store string
    price = serializers.StringRelatedField() # create a field named 'price' that will store string
    origin = serializers.StringRelatedField() # create a field named 'origin' that will store string
    destination = serializers.StringRelatedField() # create a field named 'destination' that will store string

    # create a Meta class that defines the model and it's rows to serialize
    class Meta:
        model = Booking # Booking model will be serialized by this seializer
        fields = '__all__' # '__all__' means that all the fields of the model will be serialized by this serializer
        read_only_fields = ['user', 'booking_time', 'bus', 'seat', 'price','origin','destination'] # these fields will be read only