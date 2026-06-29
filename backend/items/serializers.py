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

    collection_name = serializers.ReadOnlyField(
        source="collection.name"
    )

    images = ItemImageSerializer(
        many=True,
        read_only=True
    )

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Item

        fields = [
            "id",
            "owner",
            "collection",
            "collection_name",
            "name",
            "description",
            "images",
            "uploaded_images",
            "created_at"
        ]

    def validate_uploaded_images(self, images):

        if len(images) > 3:
            raise serializers.ValidationError(
                "O item pode possuir no máximo 3 imagens."
            )

        return images

    def create(self, validated_data):

        uploaded_images = validated_data.pop(
            "uploaded_images",
            []
        )

        item = Item.objects.create(
            **validated_data
        )

        for image in uploaded_images:

            ItemImage.objects.create(
                item=item,
                image=image
            )

        return item

    def update(self, instance, validated_data):

        uploaded_images = validated_data.pop(
            "uploaded_images",
            None
        )

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

        if uploaded_images is not None:

            instance.images.all().delete()

            if len(uploaded_images) > 3:
                raise serializers.ValidationError(
                    "O item pode possuir no máximo 3 imagens."
                )

            for image in uploaded_images:

                ItemImage.objects.create(
                    item=instance,
                    image=image
                )

        return instance