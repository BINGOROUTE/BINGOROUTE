from django.core.management.base import BaseCommand
from destinations.services.weather_service import WeatherService


class Command(BaseCommand):
    help = '날씨 API에서 데이터를 수집하여 CSV 파일로 저장합니다 (DB 저장 안함)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--cleanup-csv',
            action='store_true',
            help='오래된 CSV 파일들 정리',
        )
        parser.add_argument(
            '--days',
            type=int,
            default=7,
            help='정리할 CSV 파일의 기준 일수 (기본: 7일)',
        )

    def handle(self, *args, **options):
        try:
            if options['cleanup_csv']:
                # 오래된 CSV 파일들 정리
                days = options.get('days', 7)
                self.stdout.write(f'🗑️ {days}일 이상 된 CSV 파일들을 정리하는 중...')
                # WeatherService.cleanup_old_csv_files(days=days)
                # self.stdout.write(
                    # self.style.SUCCESS('✅ CSV 파일 정리 완료')
                # )
                return # 추후 주석 다시 지울 때 삭제 예정
            else:
                # 날씨 데이터 수집 및 CSV 저장 (기본)
                self.stdout.write('🌤️ 날씨 데이터 수집 및 CSV 저장 중...')
                result = WeatherService.collect_and_save_to_csv()
                self.stdout.write(
                    self.style.SUCCESS(f'✅ CSV 파일 생성 완료:')
                )
                if result['short_file']:
                    self.stdout.write(f'  - 단기: {result["short_file"]} ({result["short_count"]}건)')
                if result['mid_file']:
                    self.stdout.write(f'  - 중기: {result["mid_file"]} ({result["mid_count"]}건)')

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ 오류 발생: {str(e)}')
            )