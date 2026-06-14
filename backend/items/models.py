from django.db import models
from django.contrib.auth.models import User
from collections_app.models import Collection

class Item(models.Model):
    name = models.CharField(max_length=100)

    description = models.TextField(
        blank=True
    )

    image_url = models.URLField(
        blank=True
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='items'
    )

    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name='items'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name