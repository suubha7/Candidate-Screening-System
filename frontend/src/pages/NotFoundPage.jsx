import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-8xl">🤖</p>
        <h1 className="text-4xl font-bold text-white">404</h1>
        <p className="text-slate-400">This page doesn't exist in our system.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    </div>
  )
}
