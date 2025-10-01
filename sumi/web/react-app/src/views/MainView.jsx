import { useState, useEffect } from 'react' // React 훅 로드. useState: 상태 값 생성/갱신. useEffect: 생명주기 기반 부수효과 실행.
import { useNavigate } from 'react-router-dom' // 라우터 네비게이션 훅. 코드로 경로 이동 수행.

import { DESTINATIONS } from '../data/destinations' // 정적 여행지 데이터 목록 로드. 필터/검색 대상 원천 데이터.

import WeatherSection from '../components/home/WeatherSection' // 날씨 표시 영역 컴포넌트 로드. 구 선택 + 현재 날씨 출력 담당.
import RecommendationsFilter from '../components/home/RecommendationsFilter' // 지역/테마 드롭다운 필터 컴포넌트 로드.
import DestinationsGrid from '../components/home/DestinationsGrid' // 여행지 카드 그리드 컴포넌트 로드.
import HeroSection from '../components/home/HeroSection' // 상단 히어로(타이틀+CTA 버튼) 컴포넌트 로드.

import { useStore } from '../context/StoreContext' // 전역 상태 컨텍스트 훅 로드. 세션 등 공용 상태 접근.
import { useAuth } from '../hooks/useAuth' // 인증 훅 로드. 로그인 여부/로그인 유도 등 처리.
import { weatherService } from '../services/weatherService' // 날씨 API 래퍼 로드. 데이터 취득 + 포맷 함수 제공.

const MainView = () => { // 메인 화면 루트 컴포넌트 선언. 라우트: 홈 화면에 해당.
  const { session } = useStore() // 전역 세션 참조. 현재 코드에서는 직접 사용하지 않지만 추후 확장 대비.
  const { isAuthenticated, promptLogin } = useAuth() // 로그인 여부 플래그 + 로그인 요청 트리거 함수 획득.
  const navigate = useNavigate() // 프로그래매틱 네비게이션 함수 획득. navigate('/path') 형태로 이동.

  const [filter, setFilter] = useState('') // 검색어 상태. 초기값 빈 문자열. 헤더 커스텀 이벤트로 갱신 예정.

  const [selectedArea, setSelectedArea] = useState('ALL') // 지역 필터 상태. 'ALL'은 전체 허용 토큰. 비교 연산 단순화 목적.
  const [selectedTheme, setSelectedTheme] = useState('ALL') // 테마 필터 상태. 'ALL' 동일 패턴. UI 일관성 확보.

  const [selectedDistrict, setSelectedDistrict] = useState('강남구') // 날씨 구 선택 상태. 초기 디폴트 '강남구'. 데이터 수신 후 보정 예정.

  const [weatherData, setWeatherData] = useState({}) // 구별 날씨 데이터 저장 객체. 키: 구 이름, 값: 날씨 세부 정보.
  const [loading, setLoading] = useState(true) // 로딩 플래그. API 호출 전/중 true, 완료 시 false. UI 조건부 렌더링 제어.

  const areas = Array.from(new Set(DESTINATIONS.map(d => d.area))) // 지역 목록 유니크화. map으로 area 추출 → Set으로 중복 제거 → 배열 변환.
  const themes = Array.from(new Set(DESTINATIONS.flatMap(d => d.tags))) // 테마 목록 유니크화. flatMap으로 tags 합치기 → Set으로 중복 제거.

  useEffect(() => { // 컴포넌트 마운트 시 1회 실행. 날씨 데이터 취득 플로우.
    const loadWeatherData = async () => { // 비동기 함수 정의. try/finally로 로딩 상태 보장.
      setLoading(true) // 로딩 시작 표시. UI에서 스피너/문구 제어.
      try {
        const currentWeather = await weatherService.getCurrentWeather() // 원시 날씨 데이터 비동기 취득. 실패 시 catch로 이동.
        if (currentWeather) { // 데이터 유효성 1차 확인. null/undefined 방지.
          const formattedData = weatherService.formatSeoulWeatherData(currentWeather) // 화면 요구형 구조로 포맷. 키를 구명으로 정규화.
          setWeatherData(formattedData) // 상태 갱신. 이후 종속 렌더 자동 반영.

          const districts = Object.keys(formattedData) // 가용 구 목록 추출. 드롭다운 데이터 소스.
          if (districts.length > 0 && !districts.includes(selectedDistrict)) { // 초기 선택 구가 목록에 없으면 기본 첫 구로 보정.
            setSelectedDistrict(districts[0]) // 첫 번째 구 설정. UX: 공백 상태 회피.
          }
        }
      } catch (error) { // 네트워크/파싱 오류 등 예외 처리.
        console.error('날씨 데이터 로드 실패:', error) // 디버깅 로그. 사용자 알림은 상위 UI에서 처리 가능.
      } finally {
        setLoading(false) // 성공/실패 무관 로딩 종료. UI 정상 복귀 보장.
      }
    }

    loadWeatherData() // 정의된 비동기 함수 즉시 호출. IIFE 대체 패턴.
  }, []) // 의존성 배열 빈값. 마운트 1회만 실행. 재호출 방지.

  useEffect(() => { // 헤더 검색 이벤트 구독. 전역 커스텀 이벤트 → 로컬 상태 반영.
    const handleSearch = (e) => { // 이벤트 핸들러. detail 필드에 검색어 탑재 규약.
      setFilter(e.detail || '') // 안전 대입. undefined 방지 위해 Fallback 처리.
    }
    document.addEventListener('br:search', handleSearch) // 커스텀 이벤트 리스너 등록. 네임스페이스: 'br:' 접두로 충돌 완화.
    return () => document.removeEventListener('br:search', handleSearch) // 언마운트 시 정리. 메모리 누수, 중복 리스너 방지.
  }, []) // 한 번만 구독. 헤더가 이벤트 발행자 역할.

  const handleStartPlanning = () => { // 히어로 CTA 클릭 핸들러. 접근 제어 포함.
    if (!isAuthenticated) return promptLogin() // 비로그인 차단. 로그인 플로우 호출 후 조기 종료.
    navigate('/planner') // 인증 통과 시 플래너 화면으로 이동. 선언적 라우팅 보완.
  }

  const filteredDestinations = DESTINATIONS.filter(d => { // 추천 여행지 필터 파이프라인. 원본 불변 유지.
    const areaOk = selectedArea === 'ALL' || d.area === selectedArea // 지역 조건. 'ALL'이면 무조건 통과.
    const themeOk = selectedTheme === 'ALL' || d.tags.includes(selectedTheme) // 테마 조건. 태그 배열 포함성 검사.

    const query = filter.trim().toLowerCase() // 검색어 전처리. 공백 제거 + 소문자화. 비교 일관성 확보.
    const qOk =
      !query // 빈 검색어면 통과.
      || [d.name, d.area, d.short, d.tags.join(' ')].join(' ').toLowerCase().includes(query) // 대상 필드 병합 후 부분 포함 검사.

    return areaOk && themeOk && qOk // 세 조건 AND. 모두 만족 시 남김.
  }) // 성능: 데이터셋 커지면 서버측 필터/검색 또는 클라이언트 인덱싱 고려.

  const currentWeather = weatherData[selectedDistrict] || { // 선택 구의 날씨 스냅샷. 미보유 시 안전 기본값 제공.
    temp: '정보없음', // 온도 미확정 표시. UI 일관성 유지.
    humidity: '정보없음', // 습도 미확정 표시.
    wind: '정보없음', // 바람 미확정 표시.
    sky: '정보없음', // 하늘 상태 미확정 표시.
    advice: '날씨 정보를 불러오는 중입니다...' // 사용자 안내 문구. 로딩/실패 공통 Fallback.
  }

  const districts = Object.keys(weatherData) // 드롭다운에 사용할 구 목록. 데이터 상태에 따라 동적 반영.

  return ( // 화면 렌더 섹션. 상단 히어로 → 날씨 → 추천 영역 순서.
    <div className="br-container"> {/* 공통 컨테이너. 가로 폭/패딩 표준화. */}
      <HeroSection onStart={handleStartPlanning} /> {/* CTA: 여행 계획 시작. 인증 게이트 내장. */}

      <WeatherSection
        loading={loading} // 로딩 상태 전달. 조건부 렌더 제어.
        districts={districts} // 구 목록 전달. 셀렉트 옵션 소스.
        selectedDistrict={selectedDistrict} // 현재 선택 구. 제어 컴포넌트 값.
        onChangeDistrict={setSelectedDistrict} // 구 변경 핸들러. 상태 직접 갱신 함수 전달.
        currentWeather={currentWeather} // 선택 구 날씨 데이터. 표시용 베이스.
      />

      <div className="section"> {/* 추천 여행지 섹션 래퍼. 구획 시각화. */}
        <h3>추천 여행지</h3> {/* 섹션 타이틀. 접근성/구조 명확화. */}
        <RecommendationsFilter
          areas={areas} // 지역 옵션 목록. 유니크 처리 결과.
          themes={themes} // 테마 옵션 목록. 유니크 처리 결과.
          selectedArea={selectedArea} // 현재 지역 선택값. 제어 컴포넌트 값.
          selectedTheme={selectedTheme} // 현재 테마 선택값. 제어 컴포넌트 값.
          onAreaChange={setSelectedArea} // 지역 변경 핸들러. 상태 직접 갱신.
          onThemeChange={setSelectedTheme} // 테마 변경 핸들러. 상태 직접 갱신.
        />
        <DestinationsGrid items={filteredDestinations} /> {/* 필터 결과 카드 그리드 렌더. Key 관리 내부 위임. */}
      </div>
    </div>
  )
}

export default MainView // 기본 내보내기. 외부 라우터/페이지 조합에 사용.
