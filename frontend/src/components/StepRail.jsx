const STEPS = [
  { id: 1, label: 'Resume', icon: '📄' },
  { id: 2, label: 'Role', icon: '🎯' },
  { id: 3, label: 'Setup', icon: '⚙️' },
  { id: 4, label: 'Interview', icon: '🤖' },
  { id: 5, label: 'Report', icon: '📊' },
]

export default function StepRail({ currentStep }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {STEPS.map((step, idx) => {
        const done = step.id < currentStep
        const active = step.id === currentStep
        const future = step.id > currentStep

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  border-2 transition-all duration-500
                  ${done
                    ? 'bg-indigo-500 border-indigo-500 text-white'
                    : active
                      ? 'bg-navy-800 border-indigo-400 text-indigo-400 step-node-active'
                      : 'bg-navy-800 border-navy-600 text-slate-600'
                  }
                `}
              >
                {done ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
                {active && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-navy-900" />
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap transition-colors duration-300
                  ${active ? 'text-indigo-400' : done ? 'text-slate-300' : 'text-slate-600'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2 mb-5 relative overflow-hidden rounded">
                <div className="absolute inset-0 bg-navy-600" />
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-700"
                  style={{ width: done ? '100%' : active ? '50%' : '0%' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
