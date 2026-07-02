# Converte JSON para objetos Python e vice-versa
from rest_framework import serializers

from .models import (
    FavoriteItem,
    FavoriteCollection
)

from items.models import Item
from items.serializers import ItemSerializer

from collections_app.models import Collection
from collections_app.serializers import CollectionSerializer


class FavoriteItemSerializer(serializers.ModelSerializer):

    item = ItemSerializer(
        read_only=True
    )

    item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(),
        source="item",
        write_only=True
    )

    class Meta:
        model = FavoriteItem

        fields = [
            "id",
            "user",
            "item",
            "item_id"
        ]

        read_only_fields = [
            "user"
        ]

    def validate(self, attrs):

        user = self.context["request"].user

        if FavoriteItem.objects.filter(
            user=user,
            item=attrs["item"]
        ).exists():

            raise serializers.ValidationError(
                "Este item já está nos favoritos."
            )

        return attrs


class FavoriteCollectionSerializer(serializers.ModelSerializer):

    collection = CollectionSerializer(
        read_only=True
    )

    collection_id = serializers.PrimaryKeyRelatedField(
        queryset=Collection.objects.all(),
        source="collection",
        write_only=True
    )

    class Meta:
        model = FavoriteCollection

        fields = [
            "id",
            "user",
            "collection",
            "collection_id"
        ]

        read_only_fields = [
            "user"
        ]

    def validate(self, attrs):

        user = self.context["request"].user

        if FavoriteCollection.objects.filter(
            user=user,
            collection=attrs["collection"]
        ).exists():

            raise serializers.ValidationError(
                "Esta coleção já está nos favoritos."
            )

        return attrs