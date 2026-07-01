from rest_framework import serializers

from .models import (
    Item,
    ItemImage
)


class ItemImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemImage
        fields = [
            "id",
            "image"
        ]


class ItemSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(
        source="owner.username"
    )

    owner_id = serializers.IntegerField(
        source="owner.id",
        read_only=True
    )

    collection_name = serializers.ReadOnlyField(
        source="collection.name"
    )

    images = ItemImageSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Item

        fields = [
            "id",
            "owner",
            "owner_id",
            "collection",
            "collection_name",
            "name",
            "description",
            "images",
            "created_at"
        ]

    def validate_collection(self, value):

        request = self.context.get("request")

        if request and value.owner != request.user:
            raise serializers.ValidationError(
                "Você só pode mover o item para uma coleção sua."
            )

        return value

    def create(self, validated_data):

        item = Item.objects.create(
            **validated_data
        )

        return item

    def update(self, instance, validated_data):

        instance.name = validated_data.get(
            "name",
            instance.name
        )

        instance.description = validated_data.get(
            "description",
            instance.description
        )

        instance.collection = validated_data.get(
            "collection",
            instance.collection
        )

        instance.save()

        return instance