import { useState, useRef, useEffect } from 'react'

export default function usePomodoroTimer(durationMinutes, onComplete) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const intervalRef = useRef(null)
  const endTimeRef = useRef(null)

  const clearTimer = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  const updateTimeLeft = () => {
    if (!endTimeRef.current) return
    const remaining = Math.round((endTimeRef.current - Date.now()) / 1000)
    if (remaining > 0) {
      setTimeLeft(remaining)
    } else {
      setTimeLeft(0)
      clearTimer()
      if (timerStarted) {
        setTimerStarted(false)
        onComplete?.()
      }
    }
  }

  const startTimer = (minutes = durationMinutes) => {
    clearTimer()
    const durationMs = minutes * 60 * 1000
    endTimeRef.current = Date.now() + durationMs
    setTimeLeft(Math.round(durationMs / 1000))
    setTimerStarted(true)
    setIsPaused(false)
    intervalRef.current = setInterval(updateTimeLeft, 1000)
  }

  const pauseTimer = () => {
    if (!timerStarted || isPaused) return
    clearTimer()
    updateTimeLeft()
    setIsPaused(true)
  }

  const resumeTimer = () => {
    if (!timerStarted || !isPaused) return
    endTimeRef.current = Date.now() + timeLeft * 1000
    setIsPaused(false)
    intervalRef.current = setInterval(updateTimeLeft, 1000)
  }

  const reset = () => {
    clearTimer()
    endTimeRef.current = null
    setTimeLeft(0)
    setTimerStarted(false)
    setIsPaused(false)
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  // Ensure the timer updates when the page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateTimeLeft()
        // If the timer should be running but no interval is active, start it
        if (timerStarted && !isPaused && !intervalRef.current) {
          intervalRef.current = setInterval(updateTimeLeft, 1000)
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [timerStarted, isPaused])

  return {
    timeLeft,
    timerStarted,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    reset,
  }
}
