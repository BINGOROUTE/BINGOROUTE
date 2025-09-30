import './Destinations.css'
import DestinationCard from './DestinationCard'

const DestinationsGrid = ({ items = [] }) => {
  return (
    <div className="cards">
      {items.map(destination => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  )
}

export default DestinationsGrid
