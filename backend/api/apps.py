from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        from django.db.models.signals import post_save
        from django.dispatch import receiver
        from .models.user import User, Profile

        @receiver(post_save, sender=User)
        def create_user_profile(sender, instance, created, **kwargs):
            if created and not hasattr(instance, 'profile'):
                Profile.objects.create(user=instance)