# 스타일 파일 구성 안내

## 공통 스타일
- `web/react-app/src/styles/base.css` : 전역 컬러 변수와 기본 타이포그래피, 배경 등 애플리케이션 전체에 필요한 초기화 스타일.
- `web/react-app/src/styles/utilities.css` : `.section`, `.row`, `.panel`, `.brand-btn` 등 다수의 페이지에서 재사용되는 유틸리티 클래스 모음.
- `web/react-app/src/styles/planner.css` : 여행 플래너(챗봇 플래너 흐름) 관련 공용 컴포넌트에서 사용하는 스텝, 칩, 박스 스타일.

## 레이아웃
- `web/react-app/src/components/layout/Layout.css` : `Layout` 컴포넌트를 통해 모든 페이지에 적용되는 기본 컨테이너 `.br-layout`, `.br-container` 정의.
- `web/react-app/src/components/layout/Header.css` : 상단 공용 `Header` 영역 스타일. 모든 페이지에서 헤더가 동일하게 사용.

## 페이지/기능별 컴포넌트 스타일
| CSS 파일 | 적용 컴포넌트 | 포함 페이지 |
| --- | --- | --- |
| `web/react-app/src/components/features/home/HeroSection.css` | `HeroSection` | 홈 페이지 (`HomePage`)
| `web/react-app/src/components/features/weather/WeatherSection.css` | `WeatherSection`, `WeatherDisplay`, `WeatherSelector` | 홈 페이지 (`HomePage`)
| `web/react-app/src/components/features/destinations/Destinations.css` | `DestinationsGrid`, `DestinationCard` (카드 기본 레이아웃) | 홈 페이지, 마이페이지, 장소 상세 페이지
| `web/react-app/src/components/features/chat/QuickReplies.css` | `QuickReplies` | AI 챗봇 페이지 (`ChatbotView`)
| `web/react-app/src/components/features/auth/LoginRequiredModal.css` | `LoginRequiredModal` | 레이아웃 전역에서 모달 노출 시
| `web/react-app/src/views/MyPageView.css` | `MyPageView` 내부 여행 카드/리스트 전용 스타일 | 마이페이지 (`MyPageView`)



