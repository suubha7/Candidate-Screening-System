const colorMap = [
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
]

export default function SkillBadge({ label, index = 0 }) {
  const color = colorMap[index % colorMap.length]
  return (
    <span className={`badge border ${color} font-mono text-xs`}>
      {label}
    </span>
  )
}
