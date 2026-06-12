import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { generateQuestion, nextQuestion, endInterview } from '../services/api'
import { useSession } from '../context/SessionContext'

function cleanQuestionText(text = '') {
  return text
    .replace(/^\s*(?:[-*]\s*)?\d+[\).:-]\s*/, '')
    .replace(/^\s*question\s*\d+\s*[:.-]\s*/i, '')
    .trim()
}

function QuestionCard({ question, index, total }) {
  return (
    <div className="card-glow p-6 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
          <span className="text-xs font-bold font-mono text-indigo-400">Q{index}</span>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-2">
            Question {index} {total ? `of ${total}` : ''}
          </p>
          <p className="text-lg font-medium text-white leading-relaxed">{question}</p>
        </div>
      </div>
    </div>
  )
}

export default function InterviewPage() {
  const navigate = useNavigate()
  const { session, update } = useSession()
  const answerRef = useRef(null)

  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [initialQuestions, setInitialQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [history, setHistory] = useState([]) // [{question, answer}]
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [ending, setEnding] = useState(false)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('main') // 'main' | 'followup' | 'completed'
  const [questionCount, setQuestionCount] = useState(0)

  useEffect(() => {
    if (!session.sessionId) {
      navigate('/')
      return
    }

    const fetchFirst = async () => {
      try {
        const data = await generateQuestion(session.sessionId)
        const questions = Array.isArray(data.questions)
          ? data.questions.map(cleanQuestionText).filter(Boolean)
          : typeof data.questions === 'string'
            ? [cleanQuestionText(data.questions)].filter(Boolean)
            : []
        setInitialQuestions(questions)
        setCurrentQuestion(questions[0])
        setQuestionCount(1)
      } catch (err) {
        setError('Failed to generate questions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchFirst()
  }, [session.sessionId])

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const qa = { question: currentQuestion, answer: answer.trim() }
      setHistory(prev => [...prev, qa])
      const savedAnswer = answer.trim()
      setAnswer('')

      if (phase === 'main') {
        setPhase('followup')
        const data = await nextQuestion({
          session_id: session.sessionId,
          question: currentQuestion,
          answer: savedAnswer,
          role: session.roleName || '',
        })
        setCurrentQuestion(cleanQuestionText(data.next_question))
        setQuestionCount(c => c + 1)
      } else if (phase === 'followup') {
        await nextQuestion({
          session_id: session.sessionId,
          question: currentQuestion,
          answer: savedAnswer,
          role: session.roleName || '',
        })

        if (questionIndex + 1 < initialQuestions.length) {
          const nextIdx = questionIndex + 1
          setQuestionIndex(nextIdx)
          setPhase('main')
          setCurrentQuestion(initialQuestions[nextIdx])
          setQuestionCount(c => c + 1)
        } else {
          setPhase('completed')
          setCurrentQuestion(null)
        }
      }
    } catch (err) {
      setError('Failed to get next question.')
    } finally {
      setSubmitting(false)
      answerRef.current?.focus()
    }
  }

  const handleEndInterview = async () => {
    setEnding(true)
    setError('')
    try {
      await endInterview(session.sessionId)
      update({ status: 'Completed' })
      navigate('/report')
    } catch (err) {
      setError('Failed to end the interview. Please try again.')
      setEnding(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmitAnswer()
    }
  }

  return (
    <Layout
      currentStep={4}
      title="Interview in Progress"
      subtitle={`${session.roleName ? `Role: ${session.roleName} · ` : ''}Session #${session.sessionId}`}
    >
      {loading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" label="Generating questions with AI…" />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
              Q{questionCount}
            </span>
            <div className="flex-1 h-1 bg-navy-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((questionCount / 10) * 100, 100)}%` }}
              />
            </div>
            <button
              onClick={handleEndInterview}
              disabled={ending || submitting}
              className="btn-ghost text-xs text-slate-500 hover:text-red-400"
            >
              {ending ? <LoadingSpinner size="sm" /> : 'End Interview'}
            </button>
          </div>

          {/* Current question */}
          {currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              index={questionCount}
              total={initialQuestions.length * 2}
            />
          ) : phase === 'completed' ? (
            <div className="card-glow p-6 text-center animate-slide-up">
              <p className="font-medium text-white">All questions completed.</p>
              <p className="text-sm text-slate-400 mt-1">Finish the interview to generate the report.</p>
            </div>
          ) : null}

          {/* Answer input */}
          <div className="card p-5 space-y-4">
            <label className="label">Your Answer</label>
            <textarea
              ref={answerRef}
              rows={5}
              className="input-field"
              placeholder="Type your answer here… (Ctrl+Enter to submit)"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={submitting}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">Ctrl+Enter to submit</p>
              <div className="flex gap-3">
                <button
                  className="btn-secondary"
                  onClick={handleEndInterview}
                  disabled={ending || submitting || history.length === 0}
                >
                  {ending ? <LoadingSpinner size="sm" /> : 'Finish & Get Report'}
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !answer.trim() || phase === 'completed'}
                >
                  {submitting ? <LoadingSpinner size="sm" /> : null}
                  {submitting ? 'Next…' : 'Submit Answer →'}
                </button>
              </div>
            </div>
          </div>

          <ErrorAlert message={error} onDismiss={() => setError('')} />

          {/* History accordion */}
          {history.length > 0 && (
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer text-sm text-slate-400 hover:text-slate-200 transition-colors list-none select-none">
                <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                {history.length} answered question{history.length !== 1 ? 's' : ''}
              </summary>
              <div className="mt-3 space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="card p-4 space-y-2 opacity-60">
                    <p className="text-xs font-mono text-indigo-400">Q{i + 1}</p>
                    <p className="text-sm text-slate-300">{item.question}</p>
                    <div className="border-t border-navy-700 pt-2">
                      <p className="text-xs text-slate-500 mb-1">Your answer:</p>
                      <p className="text-sm text-slate-400">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </Layout>
  )
}
