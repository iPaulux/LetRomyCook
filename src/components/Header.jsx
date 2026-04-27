const CATEGORIES = ['Entrée', 'Plat', 'Dessert', 'Snack', 'Petit-déj', 'Autre']

export default function Header({ dishes, filter, onFilter, onSignOut }) {
  const avg = dishes.length
    ? (dishes.reduce((s, d) => s + d.rating, 0) / dishes.length).toFixed(1)
    : '–'

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-logo">
          <span className="logo-emoji">👩‍🍳</span>
          <div>
            <h1>LetRomyCook</h1>
            <p className="logo-tagline">la cuisine de Romy, notée avec amour</p>
          </div>
        </div>
        <div className="header-right">
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">{dishes.length}</span>
              <span className="stat-label">plat{dishes.length > 1 ? 's' : ''}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{avg}</span>
              <span className="stat-label">moy. ★</span>
            </div>
          </div>
          <button className="signout-btn" onClick={onSignOut} title="Se déconnecter">⎋</button>
        </div>
      </div>
      <nav className="filter-bar">
        <button className={`pill ${!filter ? 'active' : ''}`} onClick={() => onFilter(null)}>
          Tout
        </button>
        {CATEGORIES.map(c => {
          const count = dishes.filter(d => d.category === c).length
          if (count === 0) return null
          return (
            <button
              key={c}
              className={`pill ${filter === c ? 'active' : ''}`}
              onClick={() => onFilter(c)}
            >
              {c} <span className="pill-count">{count}</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
