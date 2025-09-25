// WeatherSection.jsx
// 역할: 선택한 '서울 구/군'의 현재 날씨를 보여주고, 드롭다운으로 구/군을 바꿀 수 있게 함.

const WeatherSection = ({
  loading,               // 로딩 중인지 표시(true/false). true면 데이터 아직 안 옴.
  districts = [],        // 구/군 목록(문자 배열). 기본값 []로 안전하게.
  selectedDistrict,      // 현재 선택된 구/군(문자열). 드롭다운의 선택값으로 사용.
  onChangeDistrict,      // 구/군이 바뀔 때 호출할 함수(부모가 내려줌).
  currentWeather         // 현재 날씨 정보 객체(예: { temp, humidity, wind, sky, advice, rainfall })
}) => {
  return ( // 화면에 보여줄 내용 반환 시작
    <div className="section"> {/* 바깥 영역(섹션) 스타일용 컨테이너 */}
      <div className="panel"> {/* 카드/패널 모양의 박스 컨테이너 */}
        <div
          className="row" // 가로 정렬을 위한 행 레이아웃
          style={{ justifyContent: 'space-between', marginBottom: '8px' }} // 양끝 정렬 + 아래 여백
        >
          <strong>실시간 날씨 정보</strong> {/* 섹션 제목(진하게) */}

          {
            loading ? ( // 데이터 로딩 중이면 드롭다운 대신 "로딩 중..."
              <span className="muted">로딩 중...</span>
            ) : (       // 로딩이 끝났으면 드롭다운 노출
              <select
                className="input"                     // 공통 입력 스타일
                value={selectedDistrict}              // 현재 선택된 구/군(제어 컴포넌트)
                onChange={(e) => onChangeDistrict(e.target.value)} // 바뀐 값 부모에게 전달
              >
                {/* 구/군 목록을 돌며 옵션 생성 */}
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option> // 항목 텍스트를 그대로 표시
                ))}
              </select>
            )
          }
        </div>

        {
          loading ? ( // 본문 영역도 로딩/완료로 나눠서 표시
            <div className="muted">날씨 정보를 불러오는 중...</div>
          ) : (
            <> {/* 빈 태그(프래그먼트): 불필요한 div 없이 묶기 */}
              <div className="meta">
                {/* 핵심 요약 라인: 온도, 습도, 바람, 하늘 상태 */}
                {/* currentWeather에서 값들을 꺼내 문장으로 보여줌 */}
                서울 {selectedDistrict} 현재 {currentWeather.temp}°C · 습도 {currentWeather.humidity}% · 바람 {currentWeather.wind} · 하늘 {currentWeather.sky}
              </div>

              <div className="muted" style={{ marginTop: '6px' }}>
                {/* 추가 안내/추천 문구(예: 우산 챙기세요 등) */}
                {currentWeather.advice}
              </div>

              {
                // 강수량 정보가 있고 숫자로 0보다 크면만 표시(= 비가 올 때만 보여주기)
                currentWeather.rainfall && parseFloat(currentWeather.rainfall) > 0 && (
                  <div className="muted" style={{ marginTop: '4px' }}>
                    강수량: {currentWeather.rainfall}mm
                  </div>
                )
              }
            </>
          )
        }
      </div>
    </div>
  )
}

export default WeatherSection // 다른 파일에서 사용할 수 있게 내보내기
