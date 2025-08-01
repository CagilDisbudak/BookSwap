from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TradeViewSet

router = DefaultRouter()
router.register(r'trades', TradeViewSet, basename='trade')

app_name = 'trades'

urlpatterns = [
    path('', include(router.urls)),
] 