import React from 'react'

function TimerProgressBar({ timeLeft, totalTime, mode }) {
  if (totalTime <= 0) return null
  const percentage = Math.max(0, Math.min(1, timeLeft / totalTime)) * 100
  const fgColor =
    mode === 'break' ? 'var(--color-accent-break)' : 'var(--color-accent-success)'
  return (
    <div className="fixed top-0 left-0 w-full h-2 bg-accent-primary z-50">
      <div
        className="h-full transition-all duration-1000"
        style={{ width: `${percentage}%`, backgroundColor: fgColor }}
      />
    </div>
  )
}

export default TimerProgressBar
