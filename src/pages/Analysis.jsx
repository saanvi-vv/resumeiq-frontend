import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnalysis, exportAnalysis } from '../api'

export default function Analysis() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalysis(id)
      .then(res => setAnalysis(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  const handleExport = async () => {
    try {
      const res = await exportAnalysis(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `resumeiq-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch { alert('Export failed') }
  }

  const getScoreColor = (score) => score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626'
  const getScoreBg = (score) => score >= 70 ? '#f0fdf4' : score >= 40 ? '#fffbeb' : '#fef2f2'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading analysis...</p>
      </div>
    )
  }

  const result = analysis?.result

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: 'var(--navy)', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <h1 style={{ fontSize: '22px', fontFamily: 'DM Serif Display, serif', color: 'white' }}>
          Resume<span style={{ color: '#c84b2f' }}>IQ</span>
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleExport}
            style={{ padding: '8px 20px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Export PDF
          </button>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '8px 20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Score Hero */}
        <div style={{ backgroundColor: 'var(--navy)', borderRadius: '20px', padding: '48px', textAlign: 'center', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(200,75,47,0.2) 0%, transparent 50%)' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            ATS Match Score
          </p>
          <p style={{ fontSize: '96px', fontWeight: '700', fontFamily: 'DM Serif Display, serif', color: 'white', lineHeight: '1', marginBottom: '16px' }}>
            {analysis.match_score}<span style={{ fontSize: '48px' }}>%</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            {result?.overall_feedback}
          </p>
        </div>

        {/* Keywords */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { title: '❌ Missing Keywords', items: result?.missing_keywords, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
            { title: '✅ Strong Keywords', items: result?.strong_keywords, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
          ].map(({ title, items, color, bg, border }) => (
            <div key={title} style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>{title}</h3>
              {items?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {items.map((kw, i) => (
                    <span key={i} style={{ backgroundColor: bg, color, border: `1px solid ${border}`, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>None found</p>
              )}
            </div>
          ))}
        </div>

        {/* Top Suggestions */}
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '20px' }}>
            Top Suggestions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result?.top_suggestions?.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '12px', backgroundColor: i === 0 ? 'var(--accent-light)' : '#fafafa', borderRadius: '8px', border: `1px solid ${i === 0 ? '#f5c5bb' : 'var(--border)'}` }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: i === 0 ? 'var(--accent)' : 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                  {i + 1}
                </span>
                <p style={{ color: 'var(--text)', fontSize: '14px', lineHeight: '1.5' }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section Breakdown */}
        <div style={{ backgroundColor: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>
          <h3 style={{ fontSize: '18px', fontFamily: 'DM Serif Display, serif', color: 'var(--text)', marginBottom: '20px' }}>
            Section Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result?.sections && Object.entries(result.sections).map(([section, details]) => (
              <div key={section} style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontWeight: '600', color: 'var(--text)', textTransform: 'capitalize', fontSize: '15px' }}>
                    {section.replace('_', ' ')}
                  </h4>
                  <span style={{ fontWeight: '700', fontFamily: 'DM Serif Display, serif', color: getScoreColor(details.score), fontSize: '18px' }}>
                    {details.score}%
                  </span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#f0ece4', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${details.score}%`, backgroundColor: getScoreColor(details.score), borderRadius: '3px', transition: 'width 0.8s ease' }} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: details.suggestions?.length ? '10px' : '0' }}>
                  {details.feedback}
                </p>
                {details.suggestions?.map((s, i) => (
                  <p key={i} style={{ color: 'var(--text-muted)', fontSize: '13px', paddingLeft: '16px', borderLeft: '2px solid var(--border)', marginTop: '6px' }}>
                    {s}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}