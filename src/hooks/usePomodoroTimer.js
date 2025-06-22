import { useState, useRef, useEffect } from 'react'

export default function usePomodoroTimer(durationMinutes, onComplete) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  const startTimer = (minutes = durationMinutes) => {
    clearTimeout(timerRef.current)
    setTimeLeft(minutes * 60)
    setTimerStarted(true)
    setIsPaused(false)
  }

  const pauseTimer = () => {
    clearTimeout(timerRef.current)
    setIsPaused(true)
  }

  const resumeTimer = () => {
    setIsPaused(false)
  }

  const reset = () => {
    clearTimeout(timerRef.current)
    setTimeLeft(0)
    setTimerStarted(false)
    setIsPaused(false)
  }

  useEffect(() => {
    clearTimeout(timerRef.current)

    if (timeLeft > 0) {
      if (!isPaused) {
        timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
      }
    } else if (timeLeft === 0 && timerStarted) {
      onComplete?.()
      setTimerStarted(false)
    }

    return () => clearTimeout(timerRef.current)
  }, [timeLeft, isPaused, timerStarted, onComplete])

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
