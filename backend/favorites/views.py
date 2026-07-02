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
        queryset = FavoriteItem.objects.select_related(
            "item",
            "item__collection"
        )

        # Favoritos são públicos: permite consultar os de qualquer usuário
        # via ?user=<id>. Sem esse parâmetro, retorna os do usuário logado.
        user_id = self.request.query_params.get("user")

        if user_id:
            return queryset.filter(user_id=user_id)

        return queryset.filter(user=self.request.user)

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
        queryset = FavoriteCollection.objects.select_related(
            "collection"
        )

        # Favoritos são públicos: permite consultar os de qualquer usuário
        # via ?user=<id>. Sem esse parâmetro, retorna os do usuário logado.
        user_id = self.request.query_params.get("user")

        if user_id:
            return queryset.filter(user_id=user_id)

        return queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )