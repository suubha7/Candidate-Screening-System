import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SkillBadge from '../components/SkillBadge'
import { uploadResume } from '../services/api'
import { useSession } from '../context/SessionContext'

export default function UploadResumePage() {
  const navigate = useNavigate()
  const { update } = useSession()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ name: '', email: '' })
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') setFile(dropped)
    else setError('Only PDF files are accepted.')
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f?.type === 'application/pdf') {
      setFile(f)
      setError('')
    } else {
      setError('Only PDF files are accepted.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !file) {
      setError('Please fill in all fields and select a PDF resume.')
      return
    }

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('resume', file)

    setLoading(true)
    setError('')

    try {
      const data = await uploadResume(formData)
      setResult(data)
      // Backend returns candidate info — store the id if present
      update({
        candidateId: data.id ?? data.candidate_id ?? 1,
        candidateName: form.name,
      })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to upload resume. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const skills = result?.skills?.skills ?? (typeof result?.skills === 'string' ? result.skills.split(',') : [])

  return (
    <Layout
      currentStep={1}
      title="Upload Your Resume"
      subtitle="We'll extract your skills automatically and tailor questions to your experience."
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="card p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="jane@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Drop zone */}
            <div>
              <label className="label">Resume (PDF)</label>
              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${dragging
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : file
                      ? 'border-emerald-500/60 bg-emerald-500/5'
                      : 'border-navy-600 hover:border-indigo-500/60 hover:bg-indigo-500/5'
                  }
                `}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">📄</div>
                    <p className="font-medium text-emerald-400">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center text-2xl">📁</div>
                    <p className="font-medium text-slate-300">Drop your PDF here</p>
                    <p className="text-xs text-slate-500">or click to browse · PDF only · max 10 MB</p>
                  </div>
                )}
              </div>
            </div>

            <ErrorAlert message={error} onDismiss={() => setError('')} />

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : null}
              {loading ? 'Analyzing Resume…' : 'Upload & Extract Skills'}
            </button>
          </form>
        </div>

        {/* Result panel */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="card-glow p-6 space-y-5 animate-slide-up">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-sm font-semibold text-emerald-400">Skills Extracted</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Detected Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0
                    ? skills.map((s, i) => <SkillBadge key={i} label={s.trim()} index={i} />)
                    : <p className="text-sm text-slate-500">No skills detected</p>
                  }
                </div>
              </div>

              {result.resume_text && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Resume Preview</p>
                  <div className="bg-navy-900/80 border border-navy-700 rounded-xl p-3 max-h-36 overflow-y-auto">
                    <p className="text-xs font-mono text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {result.resume_text.slice(0, 600)}{result.resume_text.length > 600 ? '…' : ''}
                    </p>
                  </div>
                </div>
              )}

              <button
                className="btn-primary w-full"
                onClick={() => navigate('/roles')}
              >
                Continue to Role Selection →
              </button>
            </div>
          ) : (
            <div className="card p-6 flex flex-col items-center justify-center gap-4 min-h-[200px] text-center">
              <div className="w-14 h-14 rounded-2xl bg-navy-700 flex items-center justify-center text-3xl">🤖</div>
              <div>
                <p className="font-medium text-slate-300">AI Skill Detection</p>
                <p className="text-xs text-slate-500 mt-1">
                  Upload a resume to see extracted skills and begin the screening process.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
