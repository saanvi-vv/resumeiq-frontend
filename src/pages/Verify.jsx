import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Verify() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) { setStatus('error'); return }
    axios.get(`https://resumeiq-backend-q2f1.onrender.com/auth/verify?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '20px', padding: '60px 48px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>⏳</div>
            <h2 style={{ fontSize: '26px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '8px' }}>
              Verifying your email...
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Please wait a moment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>
              ✅
            </div>
            <h2 style={{ fontSize: '28px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '12px' }}>
              Email Verified!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
              Your account is ready. You can now sign in to ResumeIQ.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '13px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Go to Login →
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '36px' }}>
              ❌
            </div>
            <h2 style={{ fontSize: '28px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '12px' }}>
              Verification Failed
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
              This link is invalid or has already been used. Please register again to get a new link.
            </p>
            <button
              onClick={() => navigate('/register')}
              style={{ width: '100%', padding: '13px', backgroundColor: 'var(--navy)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Back to Register
            </button>
          </>
        )}
      </div>
    </div>
  )
}