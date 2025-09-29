from django.db import models

class Destination(models.Model):
    name = models.CharField(max_length=100, verbose_name='장소명')
    area = models.CharField(max_length=100, verbose_name='지역')
    rating = models.DecimalField(max_digits=3, decimal_places=1, verbose_name='평점')
    duration = models.CharField(max_length=50, verbose_name='소요시간')
    short_description = models.TextField(verbose_name='간단 설명')
    long_description = models.TextField(verbose_name='상세 설명')
    image_url = models.URLField(blank=True, null=True, verbose_name='이미지 URL')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = '여행지'
        verbose_name_plural = '여행지들'
        ordering = ['-rating', 'name']

    def __str__(self):
        return f"{self.name} ({self.area})"

class DestinationTag(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='tags')
    tag_name = models.CharField(max_length=50, verbose_name='태그명')

    class Meta:
        verbose_name = '여행지 태그'
        verbose_name_plural = '여행지 태그들'
        unique_together = ['destination', 'tag_name']

    def __str__(self):
        return f"{self.destination.name} - {self.tag_name}"

class User(models.Model):
    name = models.CharField(max_length=100, verbose_name='이름')
    email = models.EmailField(unique=True, verbose_name='이메일')
    password = models.CharField(max_length=128, verbose_name='비밀번호')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = '사용자'
        verbose_name_plural = '사용자들'

    def __str__(self):
        return f"{self.name} ({self.email})"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlists')
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = '찜 목록'
        verbose_name_plural = '찜 목록들'
        unique_together = ['user', 'destination']

    def __str__(self):
        return f"{self.user.name} - {self.destination.name}"

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    title = models.CharField(max_length=200, verbose_name='여행 제목')
    duration = models.CharField(max_length=50, verbose_name='여행 기간')
    style = models.CharField(max_length=50, verbose_name='여행 스타일')
    budget = models.CharField(max_length=50, verbose_name='예산')
    companions = models.CharField(max_length=50, verbose_name='동행자')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = '여행 계획'
        verbose_name_plural = '여행 계획들'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.name} - {self.title}"

# 날씨 데이터는 CSV 파일로 관리됩니다