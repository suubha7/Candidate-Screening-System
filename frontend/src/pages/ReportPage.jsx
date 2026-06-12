import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { getReport, getInterviewQA } from '../services/api'
import { useSession } from '../context/SessionContext'

function MetricPill({ label, value, highlight = false }) {
  return (
    <div className={`card p-4 text-center ${highlight ? 'border-indigo-500/40' : ''}`}>
      <p className={`text-2xl font-bold ${highlight ? 'text-indigo-400' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  )
}

export default function ReportPage() {
  const navigate = useNavigate()
  const { session, reset } = useSession()

  const [report, setReport] = useState(null)
  const [qaList, setQaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session.sessionId) {
      navigate('/')
      return
    }

    const fetchAll = async () => {
      try {
        const [reportData, qaData] = await Promise.all([
          getReport(session.sessionId),
          getInterviewQA(session.sessionId),
        ])
        setReport(reportData)
        setQaList(qaData.questions_answers || [])
      } catch (err) {
        setError('Failed to load the report. Make sure the interview was completed.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [session.sessionId])

  const handleStartNew = () => {
    reset()
    navigate('/')
  }

  return (
    <Layout
      currentStep={5}
      title="Interview Report"
      subtitle={`Session #${session.sessionId} · ${session.candidateName ?? 'Candidate'}`}
    >
      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" label="Generating your report…" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status banner */}
          <div className="flex items-center gap-3 p-4 bg-emerald-950/50 border border-emerald-800/50 rounded-xl animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg">✅</div>
            <div>
              <p className="font-semibold text-emerald-300">Interview Completed</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Role: <span className="text-white">{session.roleName}</span>
              </p>
            </div>
          </div>

          {/* Metrics */}
          {report && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <MetricPill label="Questions Answered" value={report.questions_answered} highlight />
              <MetricPill label="Session ID" value={`#${report.session_id}`} />
              <MetricPill label="Status" value="Completed" />
            </div>
          )}

          <ErrorAlert message={error} onDismiss={() => setError('')} />

          {/* AI Report */}
          {report?.report && (
            <div className="card p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">AI Evaluation</p>
              </div>
              <div className="bg-navy-900/80 border border-navy-700 rounded-xl p-4">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{report.report}</p>
              </div>
            </div>
          )}

          {/* Q&A transcript */}
          {qaList.length > 0 && (
            <div className="card p-6 space-y-4">
              <p className="text-sm font-semibold text-white">Full Transcript</p>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {qaList.map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 text-xs font-mono flex items-center justify-center">
                        Q
                      </span>
                      <p className="text-sm text-slate-200">{item.question}</p>
                    </div>
                    <div className="flex items-start gap-2 pl-1">
                      <span className="flex-shrink-0 w-5 h-5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center justify-center">
                        A
                      </span>
                      <p className="text-sm text-slate-400">{item.answer}</p>
                    </div>
                    {i < qaList.length - 1 && <div className="border-b border-navy-700 mt-2" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => window.print()}>
              🖨️ Print Report
            </button>
            <button className="btn-primary flex-1" onClick={handleStartNew}>
              Start New Screening →
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
