from django.db import models
from django.contrib.auth.models import User

# Perfil relacionado 1-1 com ele, guarda essas campos:
class Profile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE, # Se user for apagado, o Profile dele é apagado
        related_name="profile"
    )

    image = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.user.username