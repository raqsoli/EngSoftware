from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Item
from .serializers import ItemSerializer
from users.permissions import IsOwnerOrReadOnly

from rest_framework.parsers import MultiPartParser, FormParser


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

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)