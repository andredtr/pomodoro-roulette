import { useCallback } from 'react'

export default function useInsights() {
  const generateInsights = useCallback(() => {
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
      const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
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
  }, [])

  return { generateInsights }
}
