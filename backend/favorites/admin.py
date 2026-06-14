from django.contrib import admin
from .models import FavoriteItem, FavoriteCollection

admin.site.register(FavoriteItem)
admin.site.register(FavoriteCollection)