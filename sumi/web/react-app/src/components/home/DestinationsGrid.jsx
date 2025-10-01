// 다른 파일에서 'DestinationCard'라는 레고 블록(컴포넌트)을 가져옴.
// 목적: 여기에서 카드(여행지 한 개)를 그리기 위해 재사용.
import DestinationCard from '../../components/DestinationCard'

// 'DestinationsGrid'라는 새 레고 블록(컴포넌트)을 만듦.
// 괄호 안의 { items = [] } : 부모가 넘겨주는 데이터 이름이 'items'.
// '= []'는 기본값. 아무것도 안 넘겨줘도 빈 목록으로 처리하겠다는 뜻.
const DestinationsGrid = ({ items = [] }) => {
  // 화면에 보여줄 내용을 돌려줌(return).
  return (
    // 화면을 감싸는 상자 하나를 만듦. 이름표(className) = "cards".
    // CSS에서 .cards 라고 스타일을 줄 때 씀.
    <div className="cards">
      {
        // items(목록)를 하나씩 돌면서(map) 화면 조각을 만든다.
        // destination = 목록 안의 각 한 줄(여행지 하나).
        items.map(destination => (
          // DestinationCard 블록을 한 개 그린다.
          // key={destination.id} : 각각에 번호표 달기(React가 구분하려고 필요).
          // destination={destination} : 여행지 정보를 아래 카드에 그대로 전달.
          <DestinationCard key={destination.id} destination={destination} />
        ))
      }
    </div> // 상자(div) 끝.
  ) // return 끝.
} // 컴포넌트 만들기 끝.

// 이 파일의 기본 내보내기. 다른 파일에서 이 블록을 불러다 쓸 수 있게 함.
export default DestinationsGrid
