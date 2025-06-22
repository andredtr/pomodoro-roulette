function PomodoroTimer({
  selectedTask,
  timeLeft,
  timerStarted,
  isPaused,
  pomodoroDuration,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onCompleteTask,
}) {
  if (!selectedTask) return null

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="text-center p-4 mx-auto mt-6 w-4/5 rounded-md backdrop-blur-md bg-[rgba(34,44,60,0.45)] border-2 border-accent-success">
      <h3 className="text-sm text-white/60 mb-1">Selected task</h3>
      <p className="text-xl font-semibold mb-1">{selectedTask.text}</p>
      {timeLeft === 0 ? (
        <>
          <p className="text-sm text-green-300 mt-2">Time for a {pomodoroDuration}-minute Pomodoro session!</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={onStartTimer}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Start Timer
            </button>
            {timerStarted && (
              <button
                onClick={onCompleteTask}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                ✅ Complete Task
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-green-300 mt-2">{formatTime(timeLeft)}</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={isPaused ? onResumeTimer : onPauseTimer}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={onCompleteTask}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              ✅ Complete Task
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default PomodoroTimer
