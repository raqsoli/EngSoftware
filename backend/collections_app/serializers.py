from rest_framework import serializers

from .models import Collection
from favorites.models import FavoriteCollection


class CollectionSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(
        source="owner.username"
    )

    hearts_count = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = "__all__"

    def get_hearts_count(self, obj):
        return FavoriteCollection.objects.filter(
            collection=obj
        ).count()