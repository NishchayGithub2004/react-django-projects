from django.apps import AppConfig # import AppConfig class to create app configuration

class BookingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField' # set data type for primary key
    name = 'bookings' # set name of app (must be same as folder name in project)

    # created signals will only work if we import the signals here
    def ready(self):
        import bookings.signals