import { createContext, useContext, useState } from 'react'

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [session, setSession] = useState({
    candidateId: null,
    candidateName: null,
    roleId: null,
    roleName: null,
    sessionId: null,
    status: null,
  })

  const update = (patch) => setSession(prev => ({ ...prev, ...patch }))
  const reset = () => setSession({
    candidateId: null,
    candidateName: null,
    roleId: null,
    roleName: null,
    sessionId: null,
    status: null,
  })

  return (
    <SessionContext.Provider value={{ session, update, reset }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
