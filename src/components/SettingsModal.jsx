import { useState } from 'react'

function SettingsModal({
  initialSoundsEnabled,
  initialPomodoroDuration,
  initialBreakDuration,
  onSave,
  onClose,
}) {
  const [sounds, setSounds] = useState(initialSoundsEnabled)
  const [duration, setDuration] = useState(initialPomodoroDuration)
  const [breakDuration, setBreakDuration] = useState(initialBreakDuration)
  const [insights, setInsights] = useState('')

  const generateInsights = () => {
    try {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]')
      const all = [...tasks, ...completed]
      const totalPomodoros = all.reduce((sum, t) => sum + (t.pomodoros || 0), 0)
      const now = new Date()
      const pomodorosByDay = Array(7).fill(0)
      let firstDate = null
      completed.forEach(t => {
        const date = new Date(t.completedAt)
        if (!firstDate || date < firstDate) firstDate = date
        pomodorosByDay[date.getDay()] += t.pomodoros || 0
      })
      const daysSinceFirst = firstDate ? Math.max(1, Math.ceil((now - firstDate) / (24 * 60 * 60 * 1000))) : 1
      const avgPerDay = (totalPomodoros / daysSinceFirst).toFixed(2)
      const mostProductiveIndex = pomodorosByDay.indexOf(Math.max(...pomodorosByDay))
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const productiveDay = dayNames[mostProductiveIndex] || 'N/A'
      const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000
      const monthAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000
      const yearAgo = now.getTime() - 365 * 24 * 60 * 60 * 1000
      const tasksWeek = completed.filter(t => new Date(t.completedAt).getTime() >= weekAgo).length
      const tasksMonth = completed.filter(t => new Date(t.completedAt).getTime() >= monthAgo).length
      const tasksYear = completed.filter(t => new Date(t.completedAt).getTime() >= yearAgo).length
      const hours = ((totalPomodoros * 25) / 60).toFixed(2)
      return `You completed ${totalPomodoros} pomodoros, on average you complete ${avgPerDay} pomodoros per day, your most productive day of the week is ${productiveDay}, in the past week you completed ${tasksWeek} tasks, in the past month you completed ${tasksMonth} tasks, in the past year you completed ${tasksYear} tasks, and in total you completed ${completed.length} tasks and ${totalPomodoros} pomodoros, this is about ${hours} hours of focused work.`
    } catch {
      return 'Unable to generate insights. Your browser may not allow access to local data.'
    }
  }

  const handleExport = () => {
    setInsights(generateInsights())
  }

  const handleSave = () => {
    onSave({
      soundsEnabled: sounds,
      pomodoroDuration: duration,
      breakDuration,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-bg-card p-6 rounded-md w-80">
        <h2 className="text-xl mb-4">Settings</h2>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sounds}
              onChange={(e) => setSounds(e.target.checked)}
            />
            <span>Enable Sounds</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Pomodoro Duration (minutes)</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-2 py-1 rounded bg-bg-secondary"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Break Duration (minutes)</label>
          <input
            type="number"
            min="1"
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            className="w-full px-2 py-1 rounded bg-bg-secondary"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-bg-secondary text-white rounded hover:bg-bg-secondary/80"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-red-600"
          >
            Save
          </button>
          <button
            onClick={handleExport}
            type="button"
            className="px-4 py-2 bg-accent-info text-white rounded hover:bg-accent-info/80"
          >
            Export data insights
          </button>
        </div>
        {insights && (
          <textarea
            readOnly
            value={insights}
            onFocus={(e) => e.target.select()}
            className="mt-4 w-full p-2 rounded bg-bg-secondary text-white text-sm"
            rows="6"
          />
        )}
      </div>
    </div>
  )
}

export default SettingsModal
