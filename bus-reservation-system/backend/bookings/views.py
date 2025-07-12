from django.contrib.auth import authenticate # import authenticate function to check user credentials
from rest_framework.permissions import IsAuthenticated # import IsAuthenticated class to check if user is authenticated
from rest_framework.authtoken.models import Token # import Token class to generate authentication token for user
from rest_framework import status, generics # import status to get HTTP status codes like 404, generics to get in-built views to create, update, delete and list elements
from rest_framework.views import APIView # import APIView to create class based views
from .serializers import UserRegisterSerializer, BusSerializer, BookingSerializer # import all the serializers
from rest_framework.response import Response # import Response class to send HTTP responses with custom data
from .models import Bus, Seat, Booking # import all the models

# create a class based view called 'RegisterView' to register a new user that extends/inherits 'APIView'
class RegisterView(APIView):
    # create a function called 'post' that takes HTTP request as a parameter
    def post(self, request):
        serializer = UserRegisterSerializer(data = request.data) # create an instance of 'UserRegisterSerializer' class and pass the data from the HTTP request to it
        
        # if data is valid as per serializer's rules
        if serializer.is_valid():
            user = serializer.save() # save the user data to the serializer
            token, created = Token.objects.get_or_create(user=user) # generate a token for the user if it doesn't exist already or get it's token if it already exists
            return Response({'token':token.key}, status= status.HTTP_201_CREATED) # return response of user registeration being successful with the token generated
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # otherwise return response of user registeration being unsuccessful with the errors encountered

# create a class based view called 'LoginView' to login a user that extends/inherits 'APIView'
class LoginView(APIView):
    # create a function called 'post' that takes HTTP request as a parameter
    def post(self, request):
        username = request.data.get('username') # get the username from the HTTP request
        password = request.data.get('password') # get the password from the HTTP request
        user = authenticate(username= username, password=password) # authenticate the user with the username and password

        if user: # if user is authenticated
            token, created = Token.objects.get_or_create(user=user) # generate a token for the user if it doesn't exist already or get it's token if it already exists
            # return response of user login being successful with the token generated and user id as well
            return Response({
                'token':token.key,
                'user_id': user.id
            }, status=status.HTTP_200_OK)
        
        else:
            return Response({'error':'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED) # otherwise return response of user login being unsuccessful with the error encountered

# create a class based view called 'BusListCreateView' to serialize data of 'Bus' to create and list buses that extends/inherits 'generics.ListCreateAPIView'
class BusListCreateView(generics.ListCreateAPIView):
    queryset = Bus.objects.all() # get all the buses from the database
    serializer_class = BusSerializer # serialize the data received

# create a class based view called 'BusDetailView' to serialize data of 'Bus' to retrieve, update and delete bus details that extends/inherits 'generics.RetrieveUpdateDestroyAPIView'
class BusDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bus.objects.all() # get all the buses from the database
    serializer_class = BusSerializer # serialize the data received

# create a class based view called 'BusSeatView' to book seat that extends/inherits 'generics.APIView'
class BookingView(APIView):
    permission_classes = [IsAuthenticated] # only authenticated users can access this view

    def post(self, request): # create a function called 'post' that takes HTTP request as a parameter
        seat_id = request.data.get('seat') # get the seat id from the HTTP request
        
        try:
            seat = Seat.objects.get(id = seat_id) # get record from 'Seat' model with the seat id received from the HTTP request
            
            # if seat is already booked, return error response
            if seat.is_booked:
                return Response({'error': 'Seat already booked'}, status=status.HTTP_400_BAD_REQUEST)

            # otherwise, book the seat by marking it's 'is_booked' property as True and save the booking
            seat.is_booked = True
            seat.save()

            # create a new booking record for the user, bus and seat, serialize data of the booking and return response of booking being successful
            bookings = Booking.objects.create(
                user = request.user,
                bus = seat.bus,
                seat = seat
            )
            serializer = BookingSerializer(bookings)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # if seat to book does not exist, return error response
        except Seat.DoesNotExist:
            return Response({'error':'Invalid Seat ID'}, status=status.HTTP_400_BAD_REQUEST)

# create a class based view called 'UserBookingView' to get bookings of a user that extends/inherits 'generics.APIView'
class UserBookingView(APIView):
    permission_classes= [IsAuthenticated] # only authenticated users can access this view

    # create a function called 'get' that takes HTTP request and user id as parameters
    def get(self, request, user_id):
        # if user id received from the HTTP request does not match the user id of the user who is currently logged in, return error response
        if request.user.id != user_id:
            return Response({'error':'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # filter our records from 'Booking' model with the user id received from the HTTP request and serialize data of the bookings and return the serialized data
        bookings = Booking.objects.filter(user_id = user_id)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

# create a class based view called 'DeleteBookingView' to unbook a seat that extends/inherits 'generics.APIView'
class DeleteBookingView(APIView):
    permission_classes = [IsAuthenticated] # only authenticated users can access this view

    # create a function called 'delete' that takes HTTP request and seat id as parameters
    def delete(self, request, seat_id):
        try:
            # get booking detail for the given seat and the logged-in user
            booking = Booking.objects.get(seat_id = seat_id, user = request.user)

            # unbook the seat by marking it's 'is_booked' property as False and save the unbooking action
            seat = booking.seat
            seat.is_booked = False
            seat.save()

            booking.delete() # delete the booked seat's records

            return Response({'message': 'Booking cancelled successfully'}, status=status.HTTP_204_NO_CONTENT) # return response of booking being cancelled successfully

        # if seat to unbooked was not found or user was not authorized, return error response
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)