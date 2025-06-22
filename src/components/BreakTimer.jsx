import React from 'react'

function BreakTimer({
  timeLeft,
  timerStarted,
  isPaused,
  breakDuration,
  onStartBreak,
  onPauseBreak,
  onResumeBreak,
  onEndBreak,
}) {
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  if (timeLeft === 0 && !timerStarted) {
    return (
      <div className="text-center p-4 mx-auto mt-6 w-4/5 rounded-md backdrop-blur-md bg-[rgba(34,44,60,0.45)] border-2 border-accent-success">
        <p className="text-sm text-blue-300 mt-2">Time for a {breakDuration}-minute break!</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onStartBreak}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start Break
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center p-4 mx-auto mt-6 w-4/5 rounded-md backdrop-blur-md bg-[rgba(34,44,60,0.45)] border-2 border-accent-success">
      <p className="text-2xl font-bold text-green-300 mt-2">{formatTime(timeLeft)}</p>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={isPaused ? onResumeBreak : onPauseBreak}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={onEndBreak}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          End Break
        </button>
      </div>
    </div>
  )
}

export default BreakTimer
