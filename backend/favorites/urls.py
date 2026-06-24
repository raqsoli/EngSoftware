from rest_framework.routers import DefaultRouter

from .views import (
    FavoriteItemViewSet,
    FavoriteCollectionViewSet
)

router = DefaultRouter()

router.register(
    "favorite-items",
    FavoriteItemViewSet,
    basename="favorite-items"
)

router.register(
    "favorite-collections",
    FavoriteCollectionViewSet,
    basename="favorite-collections"
)

urlpatterns = router.urls