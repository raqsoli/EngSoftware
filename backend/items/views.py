from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Item
from .serializers import ItemSerializer
from users.permissions import IsOwnerOrReadOnly


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly
    ]

    parser_classes = [
        MultiPartParser,
        FormParser
    ]

    def get_queryset(self):

        queryset = Item.objects.all()

        owner = self.request.query_params.get("owner")
        collection = self.request.query_params.get("collection")

        if owner:
            queryset = queryset.filter(owner_id=owner)

        if collection:
            queryset = queryset.filter(collection_id=collection)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)