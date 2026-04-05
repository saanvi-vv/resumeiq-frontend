import { useState } from 'react'
import { loginUser } from '../api'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(form)
      localStorage.setItem('token', res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex' }}>
      {/* Left — Decorative */}
      <div style={{
        width: '45%', backgroundColor: 'var(--navy)', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between', padding: '60px',
        position: 'relative', overflow: 'hidden'
      }} className="hidden lg:flex">
        {/* Background pattern */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(200,75,47,0.15) 0%, transparent 60%)',
        }} />
        <div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'white', fontFamily: 'DM Serif Display, serif', letterSpacing: '-1px' }}>
            Resume<span style={{ color: '#c84b2f' }}>IQ</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: '42px', lineHeight: '1.2', color: 'white', fontFamily: 'DM Serif Display, serif', marginBottom: '24px' }}>
            Your resume,<br /><em style={{ color: '#c84b2f' }}>intelligently</em><br />analyzed.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '1.6' }}>
            Upload your resume. Paste a job description.<br />Get an ATS score, missing keywords,<br />and expert feedback in seconds.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[['98%', 'Accuracy'], ['2s', 'Analysis time'], ['Free', 'To use']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white', fontFamily: 'DM Serif Display, serif' }}>{val}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="lg:hidden" style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontFamily: 'DM Serif Display, serif', color: 'var(--navy)' }}>
              Resume<span style={{ color: 'var(--accent)' }}>IQ</span>
            </h1>
          </div>

          <h2 style={{ fontSize: '28px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '8px' }}>
            Sign in
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>
            Welcome back. Let's improve your resume.
          </p>

          {error && (
            <div style={{
              backgroundColor: '#fef2f0', border: '1px solid #f5c5bb',
              color: '#c84b2f', padding: '12px 16px', borderRadius: '8px',
              marginBottom: '20px', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Email address', key: 'email', type: 'email', placeholder: 'you@gmail.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
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
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '1.5px solid var(--border)', borderRadius: '8px',
                    backgroundColor: 'white', fontSize: '15px', color: 'var(--text)',
                    outline: 'none', transition: 'border-color 0.2s'
                  }}
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
                backgroundColor: loading ? '#e8a090' : 'var(--accent)',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                marginTop: '8px', transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '500', textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}