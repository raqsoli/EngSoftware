from rest_framework import (
    viewsets,
    status
)

from rest_framework.permissions import IsAuthenticatedOrReadOnly

from rest_framework.parsers import (
    JSONParser,
    MultiPartParser,
    FormParser
)

from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import (
    Item,
    ItemImage
)

from .serializers import (
    ItemSerializer,
    ItemImageSerializer
)

from users.permissions import IsOwnerOrReadOnly


class ItemViewSet(viewsets.ModelViewSet):

    queryset = Item.objects.all()

    serializer_class = ItemSerializer

    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly
    ]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser
    ]

    def get_queryset(self):

        queryset = Item.objects.all()

        owner = self.request.query_params.get("owner")
        collection = self.request.query_params.get("collection")
        search = self.request.query_params.get("search")

        if owner:
            queryset = queryset.filter(owner_id=owner)

        if collection:
            queryset = queryset.filter(collection_id=collection)

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

    def perform_create(self, serializer):

        serializer.save(
            owner=self.request.user
        )


class ItemImagesView(APIView):

    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

    parser_classes = [
        MultiPartParser,
        FormParser
    ]

    def get(self, request, pk):

        item = get_object_or_404(
            Item,
            pk=pk
        )

        serializer = ItemImageSerializer(
            item.images.all(),
            many=True
        )

        return Response(serializer.data)

    def post(self, request, pk):

        item = get_object_or_404(
            Item,
            pk=pk
        )

        if item.owner != request.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        if item.images.count() >= 3:
            return Response(
                {
                    "error": "O item pode possuir no máximo 3 imagens."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ItemImageSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            item=item
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class ItemImageDeleteView(APIView):

    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

    def delete(self, request, pk):

        image = get_object_or_404(
            ItemImage,
            pk=pk
        )

        if image.item.owner != request.user:
            return Response(
                status=status.HTTP_403_FORBIDDEN
            )

        image.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )