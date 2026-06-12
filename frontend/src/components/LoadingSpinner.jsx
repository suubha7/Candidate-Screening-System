export default function LoadingSpinner({ size = 'md', label }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-navy-700`} />
        <div
          className={`${sizes[size]} rounded-full border-2 border-transparent border-t-indigo-500 absolute inset-0 animate-spin`}
        />
      </div>
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  )
}
