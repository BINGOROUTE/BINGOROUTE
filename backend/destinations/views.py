from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q
from django.http import JsonResponse
from .models import Destination, User, Wishlist, Trip
import datetime
from .serializers import (
    DestinationSerializer, UserSerializer, 
    WishlistSerializer, TripSerializer
)
from .services.weather_service import WeatherService

class DestinationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

    def get_queryset(self):
        queryset = Destination.objects.all()
        
        # 검색 기능
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(area__icontains=search) |
                Q(short_description__icontains=search) |
                Q(tags__tag_name__icontains=search)
            ).distinct()
        
        # 태그 필터링
        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tags__tag_name=tag)
        
        # 평점 필터링
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        
        return queryset

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(email=email, password=password)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': '이메일 또는 비밀번호가 올바르지 않습니다.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Wishlist.objects.filter(user_id=user_id)
        return Wishlist.objects.none()

class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Trip.objects.filter(user_id=user_id)
        return Trip.objects.none()

@api_view(['GET'])
def current_weather(request):
    """현재 날씨 정보 조회"""
    try:
        weather_data = WeatherService.get_current_weather_summary()
        return JsonResponse({
            'success': True,
            'data': weather_data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
def weather_forecast(request):
    """날씨 예보 조회"""
    region = request.GET.get('region', None)
    days = int(request.GET.get('days', 3))
    
    try:
        forecast_data = WeatherService.get_weather_forecast(region, days)
        return JsonResponse({
            'success': True,
            'data': list(forecast_data)
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['POST'])
def collect_weather_data(request):
    """날씨 데이터 수집 및 CSV 저장 (관리자용)"""
    try:
        result = WeatherService.collect_and_save_to_csv()
        return JsonResponse({
            'success': True,
            'message': f'날씨 데이터 CSV 저장 완료! 단기:{result["short_count"]}건, 중기:{result["mid_count"]}건',
            'data': result
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)



@api_view(['GET'])
def get_mid_forecast_for_algorithm(request):
    """추천 알고리즘용 중기예보 데이터 조회 (CSV 기반)"""
    try:
        forecast_data = WeatherService.get_mid_forecast_for_algorithm()
        return JsonResponse({
            'success': True,
            'data': forecast_data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
def get_weather_statistics(request):
    """날씨 데이터 통계 조회 (CSV 기반)"""
    try:
        stats = WeatherService.get_weather_statistics()
        return JsonResponse({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
def get_weather_by_time(request):
    """특정 시간대의 서울 구별 날씨 조회"""
    target_date = request.GET.get('date', None)  # YYYYMMDD 형식
    target_time = request.GET.get('time', None)  # HHMM 형식
    
    try:
        weather_data = WeatherService.get_weather_by_time(target_date, target_time)
        return JsonResponse({
            'success': True,
            'data': weather_data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)