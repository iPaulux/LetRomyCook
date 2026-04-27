import { useState } from 'react'

export default function AuthGate({ signIn, signUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Remplis tous les champs.'); return }
    setLoading(true)
    setError('')
    setInfo('')

    const fn = mode === 'login' ? signIn : signUp
    const { error } = await fn(email, password)

    if (error) {
      setError(error.message)
    } else if (mode === 'signup') {
      setInfo('Compte créé ! Vérifie ta boite mail pour confirmer, puis connecte-toi.')
      setMode('login')
    }
    setLoading(false)
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-emoji">👩‍🍳</span>
          <h1>LetRomyCook</h1>
          <p>la cuisine de Romy, notée avec amour</p>
        </div>

        <form onSubmit={handle} className="auth-form">
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ton@email.com"
              autoComplete="email"
              autoFocus
            />
          </div>
          <div className="form-row">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {info && <p className="form-info">{info}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login'
            ? <>Pas encore de compte ? <button onClick={() => { setMode('signup'); setError('') }}>S'inscrire</button></>
            : <>Déjà un compte ? <button onClick={() => { setMode('login'); setError('') }}>Se connecter</button></>
          }
        </p>
      </div>
    </div>
  )
}
