from django.apps import AppConfig
import threading
import os


class DestinationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'destinations'
    
    def ready(self):
        """Django 앱이 시작될 때 실행되는 초기화 메서드"""
        # 중복 실행 방지를 위한 플래그 확인
        if hasattr(self, '_weather_collection_started'):
            return
        self._weather_collection_started = True
            
        # 백그라운드에서 날씨 데이터 수집
        self.start_weather_collection()
    
    def start_weather_collection(self):
        """백그라운드에서 날씨 데이터 수집 시작"""
        def collect_weather():
            try:
                from .services.weather_service import WeatherService
                import datetime
                print("🌤️ Django 시작 시 날씨 데이터 자동 수집 확인...")
                
                # 기존 CSV 파일 확인
                latest_csv = WeatherService._get_latest_weather_csv()
                should_collect = False
                
                if not latest_csv:
                    print("📄 기존 날씨 CSV 파일이 없습니다.")
                    should_collect = True
                else:
                    # 파일 생성 시간 확인 (3시간 이상 된 파일은 새로 수집)
                    import os
                    file_time = datetime.datetime.fromtimestamp(os.path.getctime(latest_csv))
                    now = datetime.datetime.now()
                    time_diff = now - file_time
                    
                    if time_diff.total_seconds() > 3 * 3600:  # 3시간 = 10800초
                        print(f"📄 기존 CSV 파일이 {time_diff}만큼 오래되었습니다. 새로 수집합니다.")
                        should_collect = True
                    else:
                        print(f"✅ 최신 날씨 CSV 파일 발견 ({time_diff} 전), 수집 생략")
                
                if should_collect:
                    result = WeatherService.collect_and_save_to_csv()
                    print(f"✅ 날씨 데이터 자동 수집 완료! 단기:{result['short_count']}건, 중기:{result['mid_count']}건")
                
            except Exception as e:
                print(f"❌ 날씨 데이터 자동 수집 실패: {e}")
        
        # 별도 스레드에서 실행하여 Django 시작을 블록하지 않음
        thread = threading.Thread(target=collect_weather, daemon=True)
        thread.start()
