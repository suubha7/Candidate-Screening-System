import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { startInterview } from '../services/api'
import { useSession } from '../context/SessionContext'

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-navy-700 last:border-none">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-medium text-white ${mono ? 'font-mono' : ''}`}>{value ?? '—'}</span>
    </div>
  )
}

export default function StartInterviewPage() {
  const navigate = useNavigate()
  const { session, update } = useSession()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    if (!session.candidateId || !session.roleId) {
      setError('Missing candidate or role. Please go back and complete the previous steps.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await startInterview({
        candidate_id: session.candidateId,
        role_id: session.roleId,
      })
      update({ sessionId: data.session_id, status: data.status })
      navigate('/interview')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to start interview session.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      currentStep={3}
      title="Interview Setup"
      subtitle="Review the details below before starting the AI-powered interview."
    >
      <div className="max-w-lg mx-auto space-y-6">
        {/* Summary card */}
        <div className="card p-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Session Overview</p>
          <InfoRow label="Candidate" value={session.candidateName || 'Unknown'} />
          <InfoRow label="Candidate ID" value={session.candidateId} mono />
          <InfoRow label="Role" value={session.roleName || 'Unknown'} />
          <InfoRow label="Role ID" value={session.roleId} mono />
        </div>

        {/* What to expect */}
        <div className="card p-6 space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">What to expect</p>
          {[
            ['🤖', 'AI-generated questions', 'Tailored to your skills and the role requirements'],
            ['💬', 'Follow-up questions', 'The system adapts based on your answers'],
            ['📊', 'Automated report', 'A performance report is generated at the end'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="flex items-start gap-3 p-3 bg-navy-900/60 rounded-xl">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <ErrorAlert message={error} onDismiss={() => setError('')} />

        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={() => navigate('/roles')}>
            ← Back
          </button>
          <button
            className="btn-primary flex-1"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : null}
            {loading ? 'Starting…' : 'Begin Interview'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
