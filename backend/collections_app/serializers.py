from rest_framework import serializers

from .models import Collection
from favorites.models import FavoriteCollection


class CollectionSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(
        source="owner.username"
    )

    hearts_count = serializers.SerializerMethodField()

    images = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = "__all__"

    def get_hearts_count(self, obj):
        return FavoriteCollection.objects.filter(
            collection=obj
        ).count()

    def get_images(self, obj):

        request = self.context.get("request")

        images = []

        for item in obj.items.all():

            for image in item.images.all():

                if request:
                    images.append(
                        request.build_absolute_uri(
                            image.image.url
                        )
                    )
                else:
                    images.append(
                        image.image.url
                    )
                # retorna no máximo 4 imagens
                if len(images) == 4:
                    return images

        return images