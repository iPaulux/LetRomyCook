import DishCard from './DishCard'
import iconRound from '/icon-round.png'

export default function DishGrid({ dishes, onSelectDish, filter }) {
  const filtered = filter
    ? dishes.filter(d => d.category === filter)
    : dishes

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <img src={iconRound} alt="" className="empty-icon" />
        <h2>Aucun plat pour l'instant</h2>
        <p>Clique sur <strong>+</strong> pour noter le premier plat de Romy !</p>
      </div>
    )
  }

  return (
    <div className="dish-grid">
      {filtered.map(dish => (
        <DishCard key={dish.id} dish={dish} onClick={() => onSelectDish(dish)} />
      ))}
    </div>
  )
}
