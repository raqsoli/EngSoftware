from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Collection
from .serializers import CollectionSerializer
from users.permissions import IsOwnerOrReadOnly


class CollectionViewSet(viewsets.ModelViewSet):

    queryset = Collection.objects.all()

    serializer_class = CollectionSerializer

    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly
    ]

    def get_queryset(self):

        queryset = Collection.objects.all()

        owner = self.request.query_params.get("owner")
        search = self.request.query_params.get("search")

        if owner:
            queryset = queryset.filter(owner_id=owner)

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

    def perform_create(self, serializer):

        serializer.save(
            owner=self.request.user
        )