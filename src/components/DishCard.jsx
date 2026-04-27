import StarRating from './StarRating'

const CATEGORY_EMOJI = {
  'Entrée': '🥗',
  'Plat': '🍽️',
  'Dessert': '🍰',
  'Snack': '🥨',
  'Petit-déj': '☕',
  'Autre': '✨',
}

export default function DishCard({ dish, onClick }) {
  const date = new Date(dish.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <article className="dish-card" onClick={onClick}>
      <div className="dish-card-photo">
        {dish.photo
          ? <img src={dish.photo} alt={dish.name} />
          : <div className="dish-card-placeholder">{CATEGORY_EMOJI[dish.category] || '🍽️'}</div>
        }
        <div className="dish-card-overlay">
          <span className="dish-card-category">{dish.category}</span>
        </div>
      </div>
      <div className="dish-card-body">
        <h3 className="dish-card-name">{dish.name}</h3>
        <div className="dish-card-meta">
          <StarRating value={dish.rating} readonly size={14} />
          <span className="dish-card-date">{date}</span>
        </div>
        {dish.description && (
          <p className="dish-card-desc">{dish.description}</p>
        )}
      </div>
    </article>
  )
}
