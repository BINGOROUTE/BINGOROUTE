import datetime
import pandas as pd
import os
from django.conf import settings
from .weather_api import SEOUL_GU, get_current_weather, get_short_forecast, get_mid_forecast


class WeatherService:
    """날씨 데이터 수집 및 CSV 저장/조회 서비스"""
    
    # collect_and_save_weather_data 메서드 제거됨 - collect_save_and_load 사용
    
    @staticmethod
    def get_current_weather_summary():
        """현재 시간대 날씨 정보 반환 (단기 예보에서 현재 시간대 데이터 추출)"""
        try:
            # 최신 CSV 파일 찾기
            csv_file = WeatherService._get_latest_weather_csv()
            if not csv_file:
                # CSV 파일이 없으면 실시간으로 수집
                WeatherService.collect_and_save_to_csv()
                csv_file = WeatherService._get_latest_weather_csv()
                
            if not csv_file:
                return {}
            
            # CSV에서 단기 예보 데이터 읽기
            df = pd.read_csv(csv_file)
            
            # 서울 시간대 기준으로 현재 시간 계산
            import pytz
            seoul_tz = pytz.timezone('Asia/Seoul')
            now_seoul = datetime.datetime.now(seoul_tz)
            today = now_seoul.strftime("%Y%m%d")
            current_hour = now_seoul.hour
            
            # 현재 시간에 가장 가까운 예보 시간 찾기 (3시간 간격)
            forecast_hours = [0, 3, 6, 9, 12, 15, 18, 21]
            closest_hour = min(forecast_hours, key=lambda x: abs(x - current_hour))
            target_time = f"{closest_hour:02d}00"
            
            # 단기 예보에서 현재 시간대 데이터 필터링
            current_df = df[
                (df['타입'] == '단기') & 
                (df['날짜'].astype(str) == today) &
                (df['시간'].astype(str) == target_time)
            ]
            
            weather_by_region = {}
            
            for _, row in current_df.iterrows():
                region = row['지역']
                category = row['항목']
                value = row['값']
                
                if region not in weather_by_region:
                    weather_by_region[region] = {
                        'forecast_time': target_time,
                        'seoul_time': now_seoul.strftime("%Y-%m-%d %H:%M")
                    }
                
                # 항목별 매핑
                if category == 'TMP':
                    weather_by_region[region]['기온(℃)'] = str(value) if pd.notna(value) else '정보없음'
                elif category == 'WSD':
                    weather_by_region[region]['풍속(m/s)'] = str(value) if pd.notna(value) else '정보없음'
                elif category == 'PCP':
                    weather_by_region[region]['강수량(mm)'] = str(value) if pd.notna(value) else '0'
            
            return weather_by_region
            
        except Exception as e:
            print(f"❌ 현재 날씨 조회 오류: {e}")
            return {}
    
    @staticmethod
    def get_weather_forecast(region=None, days=3):
        """날씨 예보 조회 (CSV에서 읽기)"""
        try:
            # 최신 CSV 파일 찾기
            csv_file = WeatherService._get_latest_weather_csv()
            if not csv_file:
                # CSV 파일이 없으면 실시간으로 수집
                WeatherService.collect_and_save_to_csv()
                csv_file = WeatherService._get_latest_weather_csv()
                
            if not csv_file:
                return []
            
            # CSV에서 예보 데이터 읽기
            df = pd.read_csv(csv_file)
            
            # 단기 예보 데이터 필터링
            forecast_df = df[df['타입'] == '단기']
            
            if region:
                forecast_df = forecast_df[forecast_df['지역'] == region]
            
            # 날짜 범위 필터링
            today = datetime.date.today()
            end_date = (today + datetime.timedelta(days=days)).strftime("%Y%m%d")
            
            forecast_df = forecast_df[
                (forecast_df['날짜'].astype(str) >= today.strftime("%Y%m%d")) &
                (forecast_df['날짜'].astype(str) <= end_date)
            ]
            
            # 결과 정리
            forecast_data = []
            for _, row in forecast_df.iterrows():
                forecast_data.append({
                    '지역': row['지역'],
                    '날짜': row['날짜'],
                    '시간': row['시간'],
                    '항목': row['항목'],
                    '값': row['값']
                })
            
            return forecast_data
            
        except Exception as e:
            print(f"❌ 날씨 예보 조회 오류: {e}")
            return []
    
    @staticmethod
    def collect_and_save_to_csv():
        """API에서 날씨 데이터를 수집하고 CSV로 저장"""
        print("🌤️ 날씨 데이터 수집 및 CSV 저장 시작...")
        
        # API 데이터 폴더 경로
        api_data_dir = os.path.join(settings.BASE_DIR, 'api_data')
        os.makedirs(api_data_dir, exist_ok=True)
        
        today = datetime.date.today().strftime("%Y%m%d")
        short_data = []
        
        # 1. 서울 구별 단기예보 수집 (현재 시간 포함)
        for gu, (nx, ny) in SEOUL_GU.items():
            print(f"📍 {gu} 데이터 수집 중...")
            
            # 단기예보 (현재 시간부터 3일간)
            forecast_data = get_short_forecast(nx, ny)
            for forecast in forecast_data:
                short_data.append({
                    "지역": gu,
                    "타입": "단기",
                    "날짜": forecast["예보일자"],
                    "시간": forecast["예보시간"],
                    "항목": forecast["항목"],
                    "값": str(forecast["값"])
                })
        
        # 2. 서울 전체 중기예보 수집
        print("📍 서울 중기예보 수집 중...")
        mid_data = get_mid_forecast("11B10101")
        mid_formatted = []
        for mid_forecast in mid_data:
            mid_formatted.append({
                "지역": "서울",
                "타입": "중기",
                "날짜": mid_forecast["날짜"],
                "시간": mid_forecast["시간"],
                "항목": mid_forecast["항목"],
                "값": str(mid_forecast["값"])
            })
        
        # 3. CSV 파일로 저장
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        short_filename = os.path.join(api_data_dir, f"seoul_short_{timestamp}.csv")
        mid_filename = os.path.join(api_data_dir, f"seoul_mid_{timestamp}.csv")
        
        if short_data:
            pd.DataFrame(short_data).to_csv(short_filename, index=False, encoding="utf-8-sig")
            print(f"✅ 단기 데이터 CSV 저장: {short_filename}")
        
        if mid_formatted:
            pd.DataFrame(mid_formatted).to_csv(mid_filename, index=False, encoding="utf-8-sig")
            print(f"✅ 중기 데이터 CSV 저장: {mid_filename}")
        
        return {
            'short_file': short_filename if short_data else None,
            'mid_file': mid_filename if mid_formatted else None,
            'short_count': len(short_data),
            'mid_count': len(mid_formatted)
        }
    

    
    @staticmethod
    def cleanup_old_csv_files(days=7):
        """오래된 CSV 파일들 정리"""
        api_data_dir = os.path.join(settings.BASE_DIR, 'api_data')
        if not os.path.exists(api_data_dir):
            return
        
        cutoff_time = datetime.datetime.now() - datetime.timedelta(days=days)
        deleted_count = 0
        
        for filename in os.listdir(api_data_dir):
            if filename.endswith('.csv') and filename != '.gitkeep':
                file_path = os.path.join(api_data_dir, filename)
                file_time = datetime.datetime.fromtimestamp(os.path.getctime(file_path))
                
                if file_time < cutoff_time:
                    try:
                        os.remove(file_path)
                        deleted_count += 1
                        print(f"🗑️ 오래된 CSV 파일 삭제: {filename}")
                    except Exception as e:
                        print(f"❌ CSV 파일 삭제 실패: {filename} - {e}")
        
        if deleted_count > 0:
            print(f"✅ 총 {deleted_count}개의 오래된 CSV 파일을 정리했습니다.")
    
    @staticmethod
    def delete_csv_files(file_paths):
        """지정된 CSV 파일들 삭제"""
        for file_path in file_paths:
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"🗑️ CSV 파일 삭제: {os.path.basename(file_path)}")
                except Exception as e:
                    print(f"❌ CSV 파일 삭제 실패: {file_path} - {e}")
    

    
    @staticmethod
    def _get_latest_weather_csv():
        """가장 최신의 날씨 CSV 파일 경로 반환"""
        api_data_dir = os.path.join(settings.BASE_DIR, 'api_data')
        if not os.path.exists(api_data_dir):
            return None
        
        csv_files = []
        for filename in os.listdir(api_data_dir):
            if filename.startswith('seoul_short_') and filename.endswith('.csv'):
                file_path = os.path.join(api_data_dir, filename)
                csv_files.append((file_path, os.path.getctime(file_path)))
        
        if not csv_files:
            return None
        
        # 가장 최신 파일 반환
        latest_file = max(csv_files, key=lambda x: x[1])
        return latest_file[0]
    
    @staticmethod
    def get_mid_forecast_for_algorithm():
        """추천 알고리즘용 중기예보 데이터 조회 (CSV에서 읽기)"""
        try:
            # 최신 중기예보 CSV 파일 찾기
            csv_file = WeatherService._get_latest_mid_csv()
            if not csv_file:
                # CSV 파일이 없으면 실시간으로 수집
                WeatherService.collect_and_save_to_csv()
                csv_file = WeatherService._get_latest_mid_csv()
                
            if not csv_file:
                return []
            
            # CSV에서 중기예보 데이터 읽기
            df = pd.read_csv(csv_file)
            
            # 향후 7일간의 중기예보 데이터 필터링
            today = datetime.date.today()
            end_date = (today + datetime.timedelta(days=7)).strftime("%Y%m%d")
            
            mid_df = df[
                (df['타입'] == '중기') &
                (df['날짜'].astype(str) >= today.strftime("%Y%m%d")) &
                (df['날짜'].astype(str) <= end_date)
            ]
            
            # 결과 정리
            forecast_data = []
            for _, row in mid_df.iterrows():
                forecast_data.append({
                    'region': row['지역'],
                    'date': row['날짜'],
                    'period': row['시간'],
                    'weather_condition': row['값'] if row['항목'] == '날씨' else None,
                    'rain_probability': row['값'] if row['항목'] == '강수확률(%)' else None,
                    'min_temperature': row['값'] if row['항목'] == '최저기온(℃)' else None,
                    'max_temperature': row['값'] if row['항목'] == '최고기온(℃)' else None
                })
            
            return forecast_data
            
        except Exception as e:
            print(f"❌ 중기예보 조회 오류: {e}")
            return []
    
    @staticmethod
    def _get_latest_mid_csv():
        """가장 최신의 중기예보 CSV 파일 경로 반환"""
        api_data_dir = os.path.join(settings.BASE_DIR, 'api_data')
        if not os.path.exists(api_data_dir):
            return None
        
        csv_files = []
        for filename in os.listdir(api_data_dir):
            if filename.startswith('seoul_mid_') and filename.endswith('.csv'):
                file_path = os.path.join(api_data_dir, filename)
                csv_files.append((file_path, os.path.getctime(file_path)))
        
        if not csv_files:
            return None
        
        # 가장 최신 파일 반환
        latest_file = max(csv_files, key=lambda x: x[1])
        return latest_file[0]
    
    @staticmethod
    def get_weather_statistics():
        """날씨 데이터 통계 조회 (CSV 기반)"""
        try:
            short_csv = WeatherService._get_latest_weather_csv()
            mid_csv = WeatherService._get_latest_mid_csv()
            
            short_count = 0
            mid_count = 0
            
            if short_csv and os.path.exists(short_csv):
                df = pd.read_csv(short_csv)
                short_count = len(df[df['타입'] == '단기'])
            
            if mid_csv and os.path.exists(mid_csv):
                df = pd.read_csv(mid_csv)
                mid_count = len(df[df['타입'] == '중기'])
            
            return {
                'short_forecast': short_count,
                'mid_forecast': mid_count,
                'legacy_data': 0,
                'total': short_count + mid_count
            }
            
        except Exception as e:
            print(f"❌ 통계 조회 오류: {e}")
            return {
                'short_forecast': 0,
                'mid_forecast': 0,
                'legacy_data': 0,
                'total': 0
            }
    
    @staticmethod
    def get_weather_by_time(target_date=None, target_time=None):
        """특정 시간대의 서울 구별 날씨 조회"""
        try:
            # 최신 CSV 파일 찾기
            csv_file = WeatherService._get_latest_weather_csv()
            if not csv_file:
                return []
            
            # CSV에서 단기 예보 데이터 읽기
            df = pd.read_csv(csv_file)
            
            # 서울 시간대 기준으로 기본값 설정
            import pytz
            seoul_tz = pytz.timezone('Asia/Seoul')
            now_seoul = datetime.datetime.now(seoul_tz)
            
            if not target_date:
                target_date = now_seoul.strftime("%Y%m%d")
            
            if not target_time:
                current_hour = now_seoul.hour
                # 3시간 간격으로 가장 가까운 시간 찾기
                forecast_hours = [0, 3, 6, 9, 12, 15, 18, 21]
                closest_hour = min(forecast_hours, key=lambda x: abs(x - current_hour))
                target_time = f"{closest_hour:02d}00"
            
            # 해당 시간대 데이터 필터링
            time_df = df[
                (df['타입'] == '단기') & 
                (df['날짜'].astype(str) == str(target_date)) &
                (df['시간'].astype(str) == str(target_time))
            ]
            
            # 구별로 그룹화
            weather_by_region = {}
            
            for _, row in time_df.iterrows():
                region = row['지역']
                category = row['항목']
                value = row['값']
                
                if region not in weather_by_region:
                    weather_by_region[region] = {
                        'region': region,
                        'date': target_date,
                        'time': target_time,
                        'formatted_time': f"{target_time[:2]}:{target_time[2:]}",
                        'formatted_date': WeatherService._format_date(target_date)
                    }
                
                # 항목별 데이터 매핑
                if category == 'TMP':
                    weather_by_region[region]['temperature'] = value
                elif category == 'WSD':
                    weather_by_region[region]['wind_speed'] = value
                elif category == 'PCP':
                    weather_by_region[region]['precipitation'] = value
            
            return list(weather_by_region.values())
            
        except Exception as e:
            print(f"❌ 시간대별 날씨 조회 오류: {e}")
            return []
    
    @staticmethod
    def _format_date(date_string):
        """날짜 포맷팅 유틸리티"""
        if not date_string or len(date_string) != 8:
            return date_string
        
        year = date_string[:4]
        month = date_string[4:6]
        day = date_string[6:8]
        
        today = datetime.date.today()
        target_date = datetime.date(int(year), int(month), int(day))
        
        if target_date == today:
            return '오늘'
        elif target_date == today + datetime.timedelta(days=1):
            return '내일'
        else:
            return f"{month}/{day}"