import { useStore } from '../context/StoreContext'
import { DESTINATIONS } from '../data/destinations'
import ProfileSection from '../components/mypage/ProfileSection'
import WishlistSection from '../components/mypage/WishlistSection'
import TripListSection from '../components/mypage/TripListSection'

const MyPageView = () => {
  const { session, wishlist, trips } = useStore()

  if (!session) {
    return (
      <div className="br-container">
        <div className="center">
          <p>로그인이 필요합니다.</p>
        </div>
      </div>
    )
  }

  const wishlistDestinations = DESTINATIONS.filter(d => wishlist.includes(d.id))

  return (
    <div className="br-container">
      <ProfileSection session={session} />
      <WishlistSection
        wishlistDestinations={wishlistDestinations}
        wishlistCount={wishlist.length}
      />
      <TripListSection trips={trips} />
    </div>
  )
}

export default MyPageView
