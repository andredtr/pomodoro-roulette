import { useState, useRef, useEffect } from 'react'

export default function usePomodoroTimer(durationMinutes, onComplete) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const endTimeRef = useRef(null)

  const clearTimer = () => {
    clearInterval(intervalRef.current)
    clearTimeout(timeoutRef.current)
    intervalRef.current = null
    timeoutRef.current = null
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
    timeoutRef.current = setTimeout(() => {
      updateTimeLeft()
    }, durationMs + 100)
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
    timeoutRef.current = setTimeout(() => {
      updateTimeLeft()
    }, timeLeft * 1000 + 100)
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
