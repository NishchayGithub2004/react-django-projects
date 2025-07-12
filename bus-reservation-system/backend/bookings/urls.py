from django.urls import path # import path to define url patterns for the views
from .views import RegisterView, LoginView, BusListCreateView, UserBookingView, BookingView, BusDetailView, DeleteBookingView

urlpatterns = [
    path('buses/', BusListCreateView.as_view(), name='buslist'), # maps '/buses/' to BusListCreateView
    path('buses/<int:pk>/', BusDetailView.as_view(), name='bus-detail'), # maps '/buses/<int:pk>/' to BusDetailView
    path('register/', RegisterView.as_view(), name = 'register'), # maps '/register/' to RegisterView
    path('login/', LoginView.as_view(), name = 'login'), # maps '/login/' to LoginView
    path('user/<int:user_id>/bookings/', UserBookingView.as_view(), name="user-bookings"), # maps '/user/<int:user_id>/bookings/' to UserBookingView
    path('booking/', BookingView.as_view(), name="booking"), # maps '/booking/' to BookingView
    path('booking/<int:seat_id>/', DeleteBookingView.as_view(), name='delete-booking') # maps /booking/<int:seat_id>/ to DeleteBookingView
]