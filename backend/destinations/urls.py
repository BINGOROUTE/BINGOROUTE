from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DestinationViewSet, UserViewSet, WishlistViewSet, TripViewSet,
    current_weather, weather_forecast, collect_weather_data,
    get_mid_forecast_for_algorithm, get_weather_statistics, get_weather_by_time
)

router = DefaultRouter()
router.register(r'destinations', DestinationViewSet)
router.register(r'users', UserViewSet)
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'trips', TripViewSet, basename='trip')

urlpatterns = [
    path('api/', include(router.urls)),
    # 날씨 API (CSV 기반)
    path('api/weather/current/', current_weather, name='current_weather'),
    path('api/weather/forecast/', weather_forecast, name='weather_forecast'),
    path('api/weather/collect/', collect_weather_data, name='collect_weather_data'),
    path('api/weather/mid-forecast/', get_mid_forecast_for_algorithm, name='mid_forecast_algorithm'),
    path('api/weather/statistics/', get_weather_statistics, name='weather_statistics'),
    path('api/weather/by-time/', get_weather_by_time, name='weather_by_time'),
]