import { useEffect } from 'react'
import StarRating from './StarRating'

const CATEGORY_EMOJI = {
  'Entrée': '🥗',
  'Plat': '🍽️',
  'Dessert': '🍰',
  'Snack': '🥨',
  'Petit-déj': '☕',
  'Autre': '✨',
}

export default function DishDetail({ dish, onClose, onEdit, onDelete }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const date = new Date(dish.createdAt).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="detail-photo">
          {dish.photo
            ? <img src={dish.photo} alt={dish.name} />
            : <div className="detail-placeholder">{CATEGORY_EMOJI[dish.category] || '🍽️'}</div>
          }
        </div>

        <div className="detail-content">
          <div className="detail-category">{dish.category}</div>
          <h2 className="detail-name">{dish.name}</h2>
          <div className="detail-rating">
            <StarRating value={dish.rating} readonly size={22} />
            <span className="detail-rating-label">{dish.rating}/5</span>
          </div>
          <p className="detail-date">{date}</p>
          {dish.description && (
            <p className="detail-description">{dish.description}</p>
          )}
          <div className="detail-actions">
            <button className="btn btn-secondary" onClick={onEdit}>Modifier</button>
            <button className="btn btn-danger" onClick={() => { onDelete(dish.id); onClose() }}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
