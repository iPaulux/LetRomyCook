import { useState } from 'react'

export default function StarRating({ value, onChange, size = 24, readonly = false }) {
  const [hover, setHover] = useState(0)

  const stars = [1, 2, 3, 4, 5]
  const display = hover || value

  return (
    <div className="stars" style={{ '--size': size + 'px' }}>
      {stars.map(s => (
        <button
          key={s}
          type="button"
          className={`star ${s <= display ? 'filled' : ''}`}
          onClick={() => !readonly && onChange?.(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          aria-label={`${s} étoile${s > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
