import { useState, useEffect, useRef } from 'react'
import StarRating from './StarRating'

const CATEGORIES = ['Entrée', 'Plat', 'Dessert', 'Snack', 'Petit-déj', 'Autre']

async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX = 900
        let { width, height } = img
        if (width > MAX || height > MAX) {
          if (width > height) { height = (height / width) * MAX; width = MAX }
          else { width = (width / height) * MAX; height = MAX }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

const EMPTY = { name: '', description: '', category: 'Plat', rating: 0, photo: null }

export default function AddEditModal({ dish, onSave, onClose, saving }) {
  const [form, setForm] = useState(dish ? { ...dish } : { ...EMPTY })
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleFile = async (file) => {
    if (!file?.type.startsWith('image/')) return
    const compressed = await compressImage(file)
    set('photo', compressed)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Le nom du plat est requis.'); return }
    if (!form.rating) { setError('Donne une note au plat !'); return }
    onSave(form)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{dish ? 'Modifier le plat' : 'Nouveau plat'}</h2>
          <button className="detail-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Photo drop zone */}
          <div
            className={`photo-drop ${dragging ? 'dragging' : ''} ${form.photo ? 'has-photo' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            {form.photo
              ? <img src={form.photo} alt="Aperçu" />
              : <div className="photo-drop-hint">
                  <span className="photo-icon">📷</span>
                  <span>Glisse une photo ou clique</span>
                </div>
            }
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>

          <div className="form-row">
            <label>Nom du plat *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="ex: Tarte tatin aux pommes"
              autoFocus
            />
          </div>

          <div className="form-row">
            <label>Catégorie</label>
            <div className="category-pills">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`pill ${form.category === c ? 'active' : ''}`}
                  onClick={() => set('category', c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <label>Note *</label>
            <StarRating value={form.rating} onChange={v => set('rating', v)} size={30} />
          </div>

          <div className="form-row">
            <label>Notes & impressions</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Texture, saveurs, occasion… tout ce qui te passe par la tête."
              rows={4}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Enregistrement…' : dish ? 'Enregistrer' : 'Ajouter le plat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
