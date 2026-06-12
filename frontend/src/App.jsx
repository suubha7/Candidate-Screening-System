import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import UploadResumePage from './pages/UploadResumePage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import StartInterviewPage from './pages/StartInterviewPage'
import InterviewPage from './pages/InterviewPage'
import ReportPage from './pages/ReportPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadResumePage />} />
          <Route path="/roles" element={<RoleSelectionPage />} />
          <Route path="/start-interview" element={<StartInterviewPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}
