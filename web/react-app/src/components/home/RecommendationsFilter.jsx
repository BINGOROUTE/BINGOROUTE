// RecommendationsFilter.jsx
// 역할: "지역"과 "테마"를 고르는 두 개의 드롭다운을 보여주고, 선택이 바뀌면 부모에게 알려줌.

const RecommendationsFilter = (
  {
    areas = [],        // 지역 목록(문자 배열). 기본값 빈 목록. 부모가 안 주면 [] 사용.
    themes = [],       // 테마 목록(문자 배열). 기본값 빈 목록.
    selectedArea,      // 현재 선택된 지역 값(문자열). 드롭다운의 표시값으로 사용.
    selectedTheme,     // 현재 선택된 테마 값(문자열). 드롭다운의 표시값으로 사용.
    onAreaChange,      // 지역이 바뀔 때 호출할 함수(부모가 내려줌).
    onThemeChange      // 테마가 바뀔 때 호출할 함수(부모가 내려줌).
  }
) => {
  return ( // 화면에 보여줄 내용 반환 시작
    <div
      className="grid-2"                  // 두 칸 그리드 레이아웃(왼쪽: 지역, 오른쪽: 테마)
      style={{ margin: '10px 0 12px' }}   // 바깥 여백: 위 10px, 좌우 0, 아래 12px
    >
      <div> {/* 왼쪽 칸: 지역 선택 영역 */}
        <div
          className="muted"               // 흐린 보조 텍스트 스타일
          style={{ marginBottom: 6 }}     // 아래 여백 6px
        >
          지역 선택
        </div>

        {/* 지역 드롭다운(선택 상자). value로 현재 선택값 고정(제어 컴포넌트). */}
        <select
          className="input"               // 입력 요소 기본 스타일
          value={selectedArea}            // 현재 선택된 지역(부모 상태와 동기화)
          onChange={(e) => onAreaChange(e.target.value)} // 바뀌면 부모에게 새 값 전달
        >
          {/* "모든 지역" 기본 옵션. 필터를 해제하는 용도. 값은 "ALL". */}
          <option value="ALL">모든 지역</option>

          {/* areas 배열을 돌면서(option 태그 생성). 각 항목 a는 문자열. */}
          {areas.map(a => (
            <option key={a} value={a}>{a}</option> // key로 항목 텍스트 사용(중복 없다는 가정)
          ))}
        </select>
      </div>

      <div> {/* 오른쪽 칸: 테마 선택 영역 */}
        <div
          className="muted"               // 흐린 보조 텍스트 스타일
          style={{ marginBottom: 6 }}     // 아래 여백 6px
        >
          여행 테마
        </div>

        {/* 테마 드롭다운. 지역과 동일한 패턴. */}
        <select
          className="input"               // 입력 요소 기본 스타일
          value={selectedTheme}           // 현재 선택된 테마(부모 상태와 동기화)
          onChange={(e) => onThemeChange(e.target.value)} // 바뀌면 부모에게 새 값 전달
        >
          {/* "모든 테마" 기본 옵션. 필터 해제 용도. */}
          <option value="ALL">모든 테마</option>

          {/* themes 배열을 돌면서(option 태그 생성). 각 항목 t는 문자열. */}
          {themes.map(t => (
            <option key={t} value={t}>{t}</option> // key로 항목 텍스트 사용(중복 없다는 가정)
          ))}
        </select>
      </div>
    </div> // 그리드 컨테이너 끝
  ) // 반환 끝
} // 컴포넌트 정의 끝

export default RecommendationsFilter // 다른 파일에서 이 컴포넌트를 가져다 쓰기 위해 내보내기
