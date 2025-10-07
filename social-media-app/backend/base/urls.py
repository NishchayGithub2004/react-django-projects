from django.urls import path # import path function to define URL patterns
from django.conf import settings # import settings module to access project settings like MEDIA_URL and MEDIA_ROOT
from django.conf.urls.static import static # import static function to serve media files during development

from .views import get_user_profile_data, CustomTokenObtainPairView, CustomTokenRefreshView, register, auhtenticated, toggleFollow, get_users_posts, toggleLike, create_post, get_posts, search_users, logout, update_user_details # import all relevant views from current app

urlpatterns = [ # define a list of URL patterns to map endpoints to corresponding views
    path('user_data/<str:pk>/', get_user_profile_data), # map 'user_data/<username>/' URL to get_user_profile_data view
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # map 'token/' URL to CustomTokenObtainPairView for obtaining JWT tokens
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'), # map 'token/refresh/' URL to CustomTokenRefreshView for refreshing JWT tokens
    path('register/', register), # map 'register/' URL to register view for user registration
    path('authenticated/', auhtenticated), # map 'authenticated/' URL to auhtenticated view to check user authentication
    path('toggle_follow/', toggleFollow), # map 'toggle_follow/' URL to toggleFollow view for following/unfollowing users
    path('posts/<str:pk>/', get_users_posts), # map 'posts/<username>/' URL to get_users_posts view for retrieving user's posts
    path('toggleLike/', toggleLike), # map 'toggleLike/' URL to toggleLike view to like/unlike posts
    path('create_post/', create_post), # map 'create_post/' URL to create_post view to create a new post
    path('get_posts/', get_posts), # map 'get_posts/' URL to get_posts view to fetch paginated posts
    path('search/', search_users), # map 'search/' URL to search_users view to search for users
    path('update_user/', update_user_details), # map 'update_user/' URL to update_user_details view to update user profile
    path('logout/', logout) # map 'logout/' URL to logout view to clear authentication cookies
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) # append URL pattern to serve media files during development
