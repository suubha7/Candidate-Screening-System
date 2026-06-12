import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SkillBadge from '../components/SkillBadge'
import { getRoles } from '../services/api'
import { useSession } from '../context/SessionContext'

const ROLE_ICONS = {
  default: '💼',
  engineer: '⚙️',
  ml: '🤖',
  data: '📊',
  frontend: '🎨',
  backend: '🔧',
  devops: '🚀',
  product: '📱',
  design: '✏️',
}

function getRoleIcon(roleName = '') {
  const lower = roleName.toLowerCase()
  if (lower.includes('ml') || lower.includes('ai') || lower.includes('machine')) return ROLE_ICONS.ml
  if (lower.includes('data')) return ROLE_ICONS.data
  if (lower.includes('front')) return ROLE_ICONS.frontend
  if (lower.includes('back') || lower.includes('api')) return ROLE_ICONS.backend
  if (lower.includes('devops') || lower.includes('cloud')) return ROLE_ICONS.devops
  if (lower.includes('product')) return ROLE_ICONS.product
  if (lower.includes('design')) return ROLE_ICONS.design
  if (lower.includes('engineer') || lower.includes('dev')) return ROLE_ICONS.engineer
  return ROLE_ICONS.default
}

export default function RoleSelectionPage() {
  const navigate = useNavigate()
  const { session, update } = useSession()

  const [roles, setRoles] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles()
        setRoles(data)
      } catch (err) {
        setError('Could not load roles. Make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchRoles()
  }, [])

  const handleSelect = (role) => {
    setSelected(role)
    update({ roleId: role.id, roleName: role.role_name })
  }

  const handleContinue = () => {
    if (!selected) return
    navigate('/start-interview')
  }

  return (
    <Layout
      currentStep={2}
      title="Select a Role"
      subtitle="Choose the position this candidate is applying for."
    >
      <ErrorAlert message={error} onDismiss={() => setError('')} />

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" label="Loading available roles…" />
        </div>
      ) : roles.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium text-slate-300">No roles available</p>
          <p className="text-sm text-slate-500 mt-1">
            Create roles via the API first, then come back here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {roles.map((role) => {
              const skills = role.required_skills
                ? role.required_skills.split(',').map(s => s.trim()).filter(Boolean)
                : []
              const isSelected = selected?.id === role.id

              return (
                <button
                  key={role.id}
                  onClick={() => handleSelect(role)}
                  className={`
                    text-left p-5 rounded-2xl border-2 transition-all duration-200
                    ${isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-glow-indigo'
                      : 'border-navy-700 bg-navy-800 hover:border-indigo-500/50 hover:bg-navy-700'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center text-xl">
                      {getRoleIcon(role.role_name)}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className={`font-semibold mb-1 ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                    {role.role_name}
                  </p>
                  <p className="text-xs text-slate-500 mb-3">ID #{role.id}</p>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {skills.slice(0, 4).map((s, i) => (
                        <SkillBadge key={i} label={s} index={i} />
                      ))}
                      {skills.length > 4 && (
                        <span className="badge bg-navy-700 text-slate-400">+{skills.length - 4}</span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Candidate context pill */}
          {session.candidateName && (
            <div className="flex items-center gap-2 p-3 bg-navy-800 border border-navy-700 rounded-xl mb-4 w-fit">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm">👤</div>
              <p className="text-sm text-slate-300">
                Screening <span className="font-semibold text-white">{session.candidateName}</span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              ← Back
            </button>
            <button
              className="btn-primary"
              onClick={handleContinue}
              disabled={!selected}
            >
              Start Interview Setup →
            </button>
          </div>
        </>
      )}
    </Layout>
  )
}
