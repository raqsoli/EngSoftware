# Serializer conversa com o banco via ORM do Django 

from django.db import models
from django.contrib.auth.models import User
from items.models import Item
from collections_app.models import Collection


class FavoriteItem(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('user', 'item')


class FavoriteCollection(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('user', 'collection') # Impede que o usuário favorite duas vezes o mesmo item ou coleção
