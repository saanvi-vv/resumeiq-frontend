import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, getAnalyses, analyzeResume, deleteAnalysis, exportAnalysis } from '../api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, analysesRes] = await Promise.all([getMe(), getAnalyses()])
      setUser(userRes.data)
      setAnalyses(analysesRes.data)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!resume) { setError('Please upload a PDF resume'); return }
    setAnalyzing(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', resume)
      formData.append('job_description', jobDescription)
      const res = await analyzeResume(formData)
      setShowForm(false)
      setResume(null)
      setJobDescription('')
      navigate(`/analysis/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis?')) return
    try { await deleteAnalysis(id); loadData() }
    catch { setError('Failed to delete') }
  }

  const handleExport = async (id) => {
    try {
      const res = await exportAnalysis(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `resumeiq-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch { setError('Export failed') }
  }

  const getScoreColor = (score) => score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626'
  const getScoreBg = (score) => score >= 70 ? '#f0fdf4' : score >= 40 ? '#fffbeb' : '#fef2f2'
  const getScoreBorder = (score) => score >= 70 ? '#bbf7d0' : score >= 40 ? '#fde68a' : '#fecaca'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: 'var(--navy)', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <h1 style={{ fontSize: '22px', fontFamily: 'DM Serif Display, serif', color: 'white' }}>
          Resume<span style={{ color: '#c84b2f' }}>IQ</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
            {user?.name}
          </span>
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
            style={{ padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '36px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '8px' }}>
              Good to see you, {user?.name?.split(' ')[0]}.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
              {analyses.length === 0 ? 'Upload your first resume to get started.' : `You have ${analyses.length} analysis${analyses.length > 1 ? 'es' : ''} saved.`}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '12px 24px', backgroundColor: showForm ? '#e8a090' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {showForm ? 'Cancel' : '+ New Analysis'}
          </button>
        </div>

        {/* Stats */}
        {analyses.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Analyses', value: analyses.length },
              { label: 'Best Score', value: `${Math.max(...analyses.map(a => a.match_score))}%` },
              { label: 'Average Score', value: `${Math.round(analyses.reduce((a, b) => a + b.match_score, 0) / analyses.length)}%` },
            ].map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{label}</p>
                <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--navy)', fontFamily: 'DM Serif Display, serif' }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#fef2f0', border: '1px solid #f5c5bb', color: '#c84b2f', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '24px' }}>
              Analyze Your Resume
            </h3>
            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Resume PDF
                </label>
                <div style={{ border: '2px dashed var(--border)', borderRadius: '10px', padding: '24px', textAlign: 'center', cursor: 'pointer', backgroundColor: resume ? '#fef2f0' : '#fafafa' }}
                  onClick={() => document.getElementById('resumeInput').click()}>
                  <input id="resumeInput" type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} style={{ display: 'none' }} />
                  {resume ? (
                    <p style={{ color: 'var(--accent)', fontWeight: '600' }}>✓ {resume.name}</p>
                  ) : (
                    <>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Click to upload your resume</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>PDF files only</p>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={7}
                  required
                  style={{ width: '100%', padding: '14px 16px', border: '1.5px solid var(--border)', borderRadius: '10px', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.6' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <button
                type="submit"
                disabled={analyzing}
                style={{ padding: '14px', backgroundColor: analyzing ? '#e8a090' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                {analyzing ? '🤖 AI is analyzing your resume...' : 'Analyze Resume →'}
              </button>
            </form>
          </div>
        )}

        {/* Analyses List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {analyses.length === 0 && !showForm ? (
            <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '60px', textAlign: 'center' }}>
              <p style={{ fontSize: '40px', marginBottom: '16px' }}>📄</p>
              <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', color: 'var(--text)', marginBottom: '8px' }}>No analyses yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Upload your resume to get your first ATS score.</p>
            </div>
          ) : (
            analyses.map(analysis => (
              <div key={analysis.id} style={{ backgroundColor: 'white', border: `1px solid ${getScoreBorder(analysis.match_score)}`, borderRadius: '14px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: getScoreBg(analysis.match_score), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'DM Serif Display, serif', color: getScoreColor(analysis.match_score) }}>
                      {analysis.match_score}%
                    </span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>ATS Match Score</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {analysis.job_description.substring(0, 80)}...
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                      {new Date(analysis.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => navigate(`/analysis/${analysis.id}`)}
                    style={{ padding: '8px 16px', backgroundColor: 'var(--navy)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                    View
                  </button>
                  <button onClick={() => handleExport(analysis.id)}
                    style={{ padding: '8px 16px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid #f5c5bb', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                    Export
                  </button>
                  <button onClick={() => handleDelete(analysis.id)}
                    style={{ padding: '8px 16px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}