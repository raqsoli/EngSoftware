from rest_framework import serializers

from .models import (
    FavoriteItem,
    FavoriteCollection
)


class FavoriteItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavoriteItem
        fields = "__all__"
        read_only_fields = ["user"]

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

    class Meta:
        model = FavoriteCollection
        fields = "__all__"
        read_only_fields = ["user"]

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