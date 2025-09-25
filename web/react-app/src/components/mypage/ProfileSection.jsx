// 로그인된 사용자의 이름·이메일 패널만 전담
// 세션이 없으면 바로 null을 반환해 상위에서 처리하던 가드 로직을 재사용

const ProfileSection = ({ session }) => {
  if (!session) return null

  return (
    <div className="section">
      <h2>내 정보</h2>
      <div className="panel">
        <div className="grid-2">
          <div>
            <strong>이름</strong>
            <p>{session.name || session.first_name || ''}</p>
          </div>
          <div>
            <strong>이메일</strong>
            <p>{session.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
