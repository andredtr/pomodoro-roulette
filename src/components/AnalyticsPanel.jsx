import React from 'react'

function AnalyticsPanel({ completedTasks, dailyPomodoros }) {
  return (
    <div className="bg-bg-card rounded-md shadow-lg p-6 relative z-10 mt-6">
      <h2 className="mb-4">Analytics</h2>
      <p className="mb-4">Pomodoros today: <span className="font-bold">{dailyPomodoros}</span></p>
      <h3 className="font-semibold text-gray-300 mb-2">Completed Tasks ({completedTasks.length})</h3>
      {completedTasks.length === 0 ? (
        <p className="text-gray-400 italic">No tasks completed yet.</p>
      ) : (
        <ul className="space-y-2 max-h-[400px] overflow-y-auto">
          {completedTasks.map(task => (
            <li key={task.id} className="flex justify-between bg-bg-secondary p-3 rounded-md">
              <span className="truncate" title={task.text}>{task.text}</span>
              <span className="text-accent-success">{task.pomodoros} 🍅</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AnalyticsPanel
