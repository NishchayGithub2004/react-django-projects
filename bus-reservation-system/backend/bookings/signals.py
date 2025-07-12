from django.db.models.signals import post_save # import post_save signal which is triggered when a model instance is saved to the model
from django.dispatch import receiver # import receiver which is used to connect a function to a signal
from .models import Bus, Seat # import Bus and Seat model

@receiver(post_save, sender=Bus) # this function receives post_save signal from 'Bus' model
def create_seats_for_bus(sender, instance, created, **kwargs):
    if created: # if a new record is created in the 'Bus' model
        # insert all seats of the newly created and inserted bus records in the 'Seat' model
        for i in range(1, instance.no_of_seats + 1):
            Seat.objects.create(bus=instance, seat_number= f"S{i}")