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
      <div className="text-center p-4 mx-auto mt-6 w-4/5 rounded-md backdrop-blur-md bg-[rgba(34,44,60,0.45)] border-2 border-purple-300">
        <p className="text-sm text-purple-300 mt-2">Time for a {breakDuration}-minute break!</p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onStartBreak}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer"
          >
            Start Break
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center p-4 mx-auto mt-6 w-4/5 rounded-md backdrop-blur-md bg-[rgba(34,44,60,0.45)] border-2 border-purple-300">
      <p className="text-2xl font-bold text-purple-300 mt-2">{formatTime(timeLeft)}</p>
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={isPaused ? onResumeBreak : onPauseBreak}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors cursor-pointer"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={onEndBreak}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors cursor-pointer"
        >
          End Break
        </button>
      </div>
    </div>
  )
}

export default BreakTimer
