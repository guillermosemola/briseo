import { useState } from 'react'
import { supabase } from '../supabase.js'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email o contraseña incorrectos')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f4ff 0%, #f0faff 40%, #cceeff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Circulos decorativos */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(30,144,255,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(30,144,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '10%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(30,144,255,0.05)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '420px', margin: '0 20px',
        background: '#ffffff',
        borderRadius: '28px',
        border: '1px solid rgba(30,144,255,0.15)',
        boxShadow: '0 20px 60px rgba(30,144,255,0.12), 0 4px 20px rgba(0,0,0,0.08)',
        padding: '48px 40px',
        position: 'relative', zIndex: 1
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <img
            src="/logo.jpg"
            alt="Briseo Limpieza"
            style={{ width: '160px', height: 'auto', marginBottom: '8px' }}
          />
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            Sistema de Gestión Integral
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block', color: '#374151',
              fontSize: '13px', fontWeight: '600', marginBottom: '7px',
              letterSpacing: '0.3px'
            }}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%', padding: '13px 16px', boxSizing: 'border-box',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px', color: '#0f172a', fontSize: '15px',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#1e90ff'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block', color: '#374151',
              fontSize: '13px', fontWeight: '600', marginBottom: '7px',
              letterSpacing: '0.3px'
            }}>Contraseña</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '13px 16px', boxSizing: 'border-box',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px', color: '#0f172a', fontSize: '15px',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#1e90ff'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#dc2626', fontSize: '14px', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1e90ff, #0ea5e9)',
            border: 'none', borderRadius: '12px',
            color: '#ffffff', fontSize: '15px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(30,144,255,0.35)',
            transition: 'all 0.2s', letterSpacing: '0.3px'
          }}>
            {loading ? 'Ingresando...' : 'Ingresar al sistema'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', color: '#94a3b8',
          fontSize: '12px', marginTop: '28px', marginBottom: 0
        }}>
          Briseo Limpieza © 2026
        </p>
      </div>
    </div>
  )
}

export default Login
