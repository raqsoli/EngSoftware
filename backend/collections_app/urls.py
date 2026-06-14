from rest_framework.routers import DefaultRouter
from .views import CollectionViewSet

router = DefaultRouter()
router.register(r'collections', CollectionViewSet)

urlpatterns = router.urls