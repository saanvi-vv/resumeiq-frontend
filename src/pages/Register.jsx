import { useState } from 'react'
import { registerUser } from '../api'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await registerUser(form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--accent-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>
            📧
          </div>
          <h2 style={{ fontSize: '32px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '12px' }}>
            Check your inbox
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '8px' }}>
            We sent a verification link to
          </p>
          <p style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '24px' }}>{form.email}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
            Click the link to activate your account. Check your spam folder if you don't see it within a minute.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '12px 32px', backgroundColor: 'var(--navy)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
          >
            Go to Login →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '24px', fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }}>
              Resume<span style={{ color: 'var(--accent)' }}>IQ</span>
            </h1>
          </Link>
        </div>

        <h2 style={{ fontSize: '32px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '8px' }}>
          Create account
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>
          Start analyzing your resume for free.
        </p>

        {error && (
          <div style={{ backgroundColor: '#fef2f0', border: '1px solid #f5c5bb', color: '#c84b2f', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Saanvi Vijayvergia' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@gmail.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 8 characters' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                required
                minLength={key === 'password' ? 8 : undefined}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: '8px', backgroundColor: 'white', fontSize: '15px', color: 'var(--text)', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              backgroundColor: loading ? '#4c1d95' : 'var(--accent)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span>Creating account... (may take ~30s on first load)</span>
            ) : (
              'Create Account →'
            )}
          </button>
        </form>

        <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '500', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}