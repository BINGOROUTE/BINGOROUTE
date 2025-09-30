from rest_framework import serializers
from .models import Destination, DestinationTag, User, Wishlist, Trip

class DestinationTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationTag
        fields = ['tag_name']

class DestinationSerializer(serializers.ModelSerializer):
    tags = DestinationTagSerializer(many=True, read_only=True)
    tag_names = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = [
            'id', 'name', 'area', 'rating', 'duration', 
            'short_description', 'long_description', 'image_url',
            'tags', 'tag_names', 'created_at', 'updated_at'
        ]

    def get_tag_names(self, obj):
        return [tag.tag_name for tag in obj.tags.all()]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}

class WishlistSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'destination', 'created_at']

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'id', 'title', 'duration', 'style', 'budget', 
            'companions', 'created_at'
        ]
# 날씨 데이터는 CSV 파일로 관리되므로 Serializer가 필요하지 않습니다