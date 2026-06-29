from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ItemViewSet,
    ItemImageView
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
        ItemImageView.as_view(),
        name="item-images"
    ),

    path(
        "item-images/<int:pk>/",
        ItemImageView.as_view(),
        name="delete-item-image"
    ),
]