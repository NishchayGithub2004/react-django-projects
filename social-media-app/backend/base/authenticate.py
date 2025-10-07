from rest_framework_simplejwt.authentication import JWTAuthentication # import JWTAuthentication to handle JWT-based authentication

class CookiesAuthentication(JWTAuthentication): # define a class CookiesAuthentication to authenticate users using JWT tokens stored in cookies
    def authenticate(self, request): # define a method authenticate to check and validate JWT token from incoming request, takes request as argument
        access_token = request.COOKIES.get('access_token') # get the 'access_token' value from request cookies dictionary

        if not access_token: # check if access_token does not exist in cookies
            return None # return None to indicate authentication failure due to missing token
        
        validated_token = self.get_validated_token( # call get_validated_token method to validate and decode JWT token
            access_token # pass access_token string as argument for validation
        )

        try: # use try block to safely attempt user retrieval from validated token
            user = self.get_user( # call get_user method to fetch user instance associated with validated token
                validated_token # pass validated token as argument to extract user
            )
        except: # handle exceptions if token is invalid or user not found
            return None # return None to indicate failed authentication
        
        return (user, validated_token) # return a tuple containing authenticated user object and validated token
