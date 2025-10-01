// Info.jsx                                                             // 파일명 주석. 이 컴포넌트는 상세 정보 + 방문 정보 표시 역할.

import React from 'react'                                               // React 임포트. JSX 문법을 사용하기 위해 필요.

const Info = ({ destination }) => {                                     // 함수형 컴포넌트 선언. props에서 destination만 구조 분해.
  return (
    <>                                                                  {/* 빈 태그(Fragment). 여러 최상위 요소를 묶기 위해 사용. */}
      {/* 상세 정보 섹션 */}
      <div className="section">                                         {/* 외곽 섹션 박스. 공통 여백/레이아웃 스타일 제공. */}
        <div className="panel">                                         {/* 안쪽 패널 박스. 테두리/배경 등 카드 형태 스타일 */}
          <h3>상세 정보</h3>                                            {/* 소제목. "상세 정보" 표시 */}
          <p>{destination.long}</p>                                     {/* 장소의 상세 설명 텍스트. props에서 전달된 long 속성 출력 */}
        </div>
      </div>

      {/* 방문 정보 섹션 */}
      <div className="section">                                         {/* 외곽 섹션 박스 */}
        <div className="panel">                                         {/* 안쪽 패널 박스 */}
          <h3>방문 정보</h3>                                            {/* 소제목. "방문 정보" 표시 */}
          <div className="grid-2">                                      {/* 2열 그리드 레이아웃. 왼쪽/오른쪽 두 칼럼 배치 */}
            <div>                                                       {/* 왼쪽 칼럼 */}
              <strong>추천 소요시간</strong>                           {/* 라벨: 추천 소요시간 */}
              <p>{destination.duration}</p>                             {/* 값: props에서 전달된 duration */}
            </div>
            <div>                                                       {/* 오른쪽 칼럼 */}
              <strong>평점</strong>                                     {/* 라벨: 평점 */}
              <p>{destination.rating}/5.0</p>                           {/* 값: 평점 숫자 + "/5.0" */}
            </div>
          </div>
          <div>                                                         {/* 태그 영역 전체 */}
            <strong>태그</strong>                                       {/* 라벨: 태그 */}
            <div style={{ marginTop: '8px' }}>                          {/* 위쪽 여백 8px */}
              {destination.tags.map(tag => (                           // 태그 배열을 순회하며 하나씩 화면에 출력
                <span
                  key={tag}                                             // React 렌더링 최적화를 위한 고유 key
                  className="pill"                                      // pill 스타일(작은 배지 형태)
                  style={{ marginRight: '8px' }}                        // 오른쪽 여백 8px
                >
                  {tag}                                                 {/* 태그 문자열 출력 */}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Info                                                     // 기본 내보내기. 다른 파일에서 import 가능.
