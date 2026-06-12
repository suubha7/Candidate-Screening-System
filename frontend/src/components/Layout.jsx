import { useNavigate } from 'react-router-dom'
import StepRail from './StepRail'
import { useSession } from '../context/SessionContext'

export default function Layout({ children, currentStep, title, subtitle }) {
  const { session, reset } = useSession()
  const navigate = useNavigate()

  const handleReset = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-navy-800 bg-navy-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={handleReset} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-glow-indigo">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none group-hover:text-indigo-300 transition-colors">AI Screening</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Candidate Portal</p>
            </div>
          </button>

          {/* Session pill */}
          {session.sessionId && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-800 border border-navy-700 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-slate-400">
                Session <span className="text-cyan-400">#{session.sessionId}</span>
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Step rail */}
      <div className="border-b border-navy-800 bg-navy-900/40">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <StepRail currentStep={currentStep} />
        </div>
      </div>

      {/* Page header */}
      {(title || subtitle) && (
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-2 w-full">
          <div className="animate-slide-up">
            {title && <h1 className="section-title">{title}</h1>}
            {subtitle && <p className="section-sub">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-6 w-full">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-800 py-4 text-center">
        <p className="text-xs text-slate-600">
          AI-Powered Candidate Screening System
        </p>
      </footer>
    </div>
  )
}
