import { useState } from 'react'
import { supabaseConfigured } from './lib/supabase'
import { useAuth } from './hooks/useAuth'
import { useDishes } from './hooks/useDishes'
import AuthGate from './components/AuthGate'
import Header from './components/Header'
import DishGrid from './components/DishGrid'
import DishDetail from './components/DishDetail'
import AddEditModal from './components/AddEditModal'
import './App.css'

export default function App() {
  const { user, signIn, signUp, signOut } = useAuth()
  const { dishes, loading, error, addDish, updateDish, deleteDish } = useDishes(user)

  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState(null)
  const [saving, setSaving] = useState(false)

  if (!supabaseConfigured) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="logo-emoji">⚙️</span>
            <h1>Configuration manquante</h1>
            <p>Les variables d'environnement Supabase ne sont pas définies.</p>
          </div>
          <div className="config-help">
            <p>Ajoute ces variables dans Netlify → <strong>Site configuration → Environment variables</strong> :</p>
            <code>VITE_SUPABASE_URL</code>
            <code>VITE_SUPABASE_ANON_KEY</code>
            <p style={{marginTop: 12}}>Puis relance un déploiement.</p>
          </div>
        </div>
      </div>
    )
  }

  // Auth still loading
  if (user === undefined) {
    return (
      <div className="splash">
        <span className="logo-emoji" style={{ fontSize: 48 }}>👩‍🍳</span>
      </div>
    )
  }

  if (!user) {
    return <AuthGate signIn={signIn} signUp={signUp} />
  }

  const openEdit = (dish) => { setSelected(null); setEditing(dish) }

  const handleSave = async (form) => {
    setSaving(true)
    try {
      if (editing) await updateDish(editing.id, form)
      else await addDish(form)
    } finally {
      setSaving(false)
      setEditing(null)
      setAdding(false)
    }
  }

  return (
    <div className="app">
      <Header
        dishes={dishes}
        filter={filter}
        onFilter={setFilter}
        onSignOut={signOut}
      />

      <main className="main">
        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Chargement des plats…</p>
          </div>
        )}
        {error && <p className="form-error" style={{ margin: 24 }}>{error}</p>}
        {!loading && (
          <DishGrid dishes={dishes} onSelectDish={setSelected} filter={filter} />
        )}
      </main>

      <button className="fab" onClick={() => setAdding(true)} aria-label="Ajouter un plat">+</button>

      {selected && (
        <DishDetail
          dish={selected}
          onClose={() => setSelected(null)}
          onEdit={() => openEdit(selected)}
          onDelete={deleteDish}
        />
      )}

      {(adding || editing) && (
        <AddEditModal
          dish={editing || null}
          onSave={handleSave}
          onClose={() => { setAdding(false); setEditing(null) }}
          saving={saving}
        />
      )}
    </div>
  )
}
