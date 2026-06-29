from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import (
    FavoriteItem,
    FavoriteCollection
)

from .serializers import (
    FavoriteItemSerializer,
    FavoriteCollectionSerializer
)


class FavoriteItemViewSet(viewsets.ModelViewSet):

    serializer_class = FavoriteItemSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        return FavoriteItem.objects.filter(
            user=self.request.user
        ).select_related(
            "item",
            "item__collection"
        )


    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class FavoriteCollectionViewSet(viewsets.ModelViewSet):

    serializer_class = FavoriteCollectionSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        return FavoriteCollection.objects.filter(
            user=self.request.user
        ).select_related(
            "collection"
        )


    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )