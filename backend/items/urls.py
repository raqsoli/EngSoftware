from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ItemViewSet,
    ItemImagesView,
    ItemImageDeleteView
)

router = DefaultRouter()

router.register(
    r"items",
    ItemViewSet
)

urlpatterns = router.urls

urlpatterns += [

    path(
        "items/<int:pk>/images/",
        ItemImagesView.as_view(),
        name="item-images"
    ),

    path(
        "item-images/<int:pk>/",
        ItemImageDeleteView.as_view(),
        name="delete-item-image"
    ),
]