import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { getReport, downloadReportPdf } from '../services/api'
import { useSession } from '../context/SessionContext'

function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-900/60 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white break-words">{value || 'Not available'}</p>
    </div>
  )
}

function splitLines(value) {
  if (!value) return ['Not available']
  return value
    .split('\n')
    .map(line => line.replace(/^\s*[-*]\s*/, '').trim())
    .filter(Boolean)
}

function EvaluationSection({ title, value, list = false }) {
  const items = splitLines(value)

  return (
    <div className="rounded-lg border border-navy-700 bg-navy-900/70 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
      {list ? (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex gap-2 text-sm leading-relaxed text-slate-300">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{items.join('\n')}</p>
      )}
    </div>
  )
}

function getFilenameFromDisposition(disposition, fallback) {
  const match = disposition?.match(/filename="?([^"]+)"?/i)
  return match?.[1] || fallback
}

export default function ReportPage() {
  const navigate = useNavigate()
  const { session, reset } = useSession()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session.sessionId) {
      navigate('/')
      return
    }

    const fetchReport = async () => {
      try {
        const reportData = await getReport(session.sessionId)
        setReport(reportData)
      } catch (err) {
        setError('Failed to load the report. Make sure the interview was completed.')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [session.sessionId])

  const handleDownloadPdf = async () => {
    setDownloading(true)
    setError('')

    try {
      const response = await downloadReportPdf(session.sessionId)
      const filename = getFilenameFromDisposition(
        response.headers['content-disposition'],
        `Session_${session.sessionId}_Report.pdf`
      )
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message || 'Failed to download the PDF report. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleStartNew = () => {
    reset()
    navigate('/')
  }

  const candidate = report?.candidate || {}
  const role = report?.role || {}
  const evaluation = report?.evaluation || {}

  return (
    <Layout
      currentStep={5}
      title="Interview Report"
      subtitle={`Session #${session.sessionId} · ${candidate.name || session.candidateName || 'Candidate'}`}
    >
      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" label="Generating report..." />
        </div>
      ) : (
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/40 p-5 animate-slide-up">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-300">Interview Evaluation Ready</p>
                <p className="mt-1 text-xs text-slate-400">
                  Recruiter-ready summary without transcript or question history.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="btn-secondary"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                >
                  {downloading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  )}
                  {downloading ? 'Downloading...' : 'Download PDF Report'}
                </button>
                <button className="btn-primary" onClick={handleStartNew}>
                  Start New Screening
                </button>
              </div>
            </div>
          </div>

          <ErrorAlert message={error} onDismiss={() => setError('')} />

          <section className="card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">Candidate Information</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Session Summary</h2>
              </div>
              <div className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                {report?.status || 'Completed'}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem label="Name" value={candidate.name || session.candidateName} />
              <InfoItem label="Email" value={candidate.email} />
              <InfoItem label="Role" value={role.name || session.roleName} />
              <InfoItem label="Experience Level" value={report?.experience_level || session.experienceLevel} />
              <InfoItem label="Session ID" value={report?.session_id ? `#${report.session_id}` : `#${session.sessionId}`} />
              <InfoItem label="Status" value={report?.status || 'Completed'} />
            </div>
          </section>

          <section className="card p-6">
            <div className="mb-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">Interview Evaluation</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Recruiter Assessment</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <EvaluationSection title="Overall Rating" value={evaluation.overall_rating} />
              <EvaluationSection title="Job Eligibility" value={evaluation.job_eligibility} />
              <EvaluationSection title="Strengths" value={evaluation.strengths} list />
              <EvaluationSection title="Weaknesses" value={evaluation.weaknesses} list />
              <EvaluationSection title="Knowledge Gaps" value={evaluation.knowledge_gaps} list />
              <EvaluationSection title="Recommendations" value={evaluation.recommendations} list />
              <div className="lg:col-span-2">
                <EvaluationSection title="Reason" value={evaluation.reason} />
              </div>
            </div>
          </section>
        </div>
      )}
    </Layout>
  )
}
