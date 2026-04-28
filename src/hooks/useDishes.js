import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return res.blob()
}

async function uploadPhoto(dataUrl, dishId, userId) {
  const blob = await dataUrlToBlob(dataUrl)
  const path = `${userId}/${dishId}.jpg`
  const { error } = await supabase.storage
    .from('dish-photos')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('dish-photos').getPublicUrl(path)
  return data.publicUrl
}

function mapRow(row) {
  return { ...row, photo: row.photo_url, createdAt: row.created_at }
}

export function useDishes(user, scope = 'mine') {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    let q = supabase
      .from('dishes')
      .select('*')
      .order('created_at', { ascending: false })
    if (scope === 'mine') q = q.eq('user_id', user.id)
    q.then(({ data, error }) => {
      if (error) setError(error.message)
      else setDishes((data ?? []).map(mapRow))
      setLoading(false)
    })
  }, [user, scope])

  const addDish = async (form) => {
    const id = crypto.randomUUID()
    let photoUrl = null
    if (form.photo?.startsWith('data:')) {
      photoUrl = await uploadPhoto(form.photo, id, user.id)
    }
    const { data, error } = await supabase
      .from('dishes')
      .insert({
        id,
        user_id: user.id,
        author_name: user.email.split('@')[0],
        name: form.name,
        description: form.description || null,
        category: form.category,
        rating: form.rating,
        photo_url: photoUrl,
      })
      .select()
      .single()
    if (error) throw error
    setDishes(prev => [mapRow(data), ...prev])
  }

  const updateDish = async (id, form) => {
    let photoUrl = form.photo?.startsWith('https://') ? form.photo : null
    if (form.photo?.startsWith('data:')) {
      photoUrl = await uploadPhoto(form.photo, id, user.id)
    }
    const { data, error } = await supabase
      .from('dishes')
      .update({
        name: form.name,
        description: form.description || null,
        category: form.category,
        rating: form.rating,
        photo_url: photoUrl,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setDishes(prev => prev.map(d => d.id === id ? mapRow(data) : d))
  }

  const deleteDish = async (id) => {
    const { error } = await supabase.from('dishes').delete().eq('id', id)
    if (error) throw error
    setDishes(prev => prev.filter(d => d.id !== id))
  }

  return { dishes, loading, error, addDish, updateDish, deleteDish }
}
