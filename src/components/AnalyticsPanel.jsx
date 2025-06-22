import React, { useEffect, useState } from 'react'
import ChevronIcon from './icons/ChevronIcon'

function AnalyticsPanel({ completedTasks, dailyPomodoros }) {
  const pageSize = 5
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [completedTasks.length])

  const totalPages = Math.ceil(completedTasks.length / pageSize)
  const start = Math.max(0, completedTasks.length - pageSize * (page + 1))
  const end = completedTasks.length - pageSize * page
  const pageTasks = completedTasks.slice(start, end).reverse()

  return (
    <div className="bg-bg-card rounded-md shadow-lg p-6 relative z-10 mt-6">
      <h2 className="mb-4">Analytics</h2>
      <p className="mb-4">Pomodoros today: <span className="font-bold">{dailyPomodoros}</span></p>
      <h3 className="font-semibold text-gray-300 mb-2">Completed Tasks ({completedTasks.length})</h3>
      {completedTasks.length === 0 ? (
        <p className="text-gray-400 italic">No tasks completed yet.</p>
      ) : (
        <>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {pageTasks.map(task => (
              <li key={task.id} className="flex justify-between bg-bg-secondary p-3 rounded-md">
                <span className="truncate" title={task.text}>{task.text}</span>
                <span className="text-accent-success">{task.pomodoros} 🍅</span>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page <= 0}
                className={`px-3 py-1 rounded-pill flex items-center gap-1 bg-bg-secondary text-sm ${
                  page <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bg-secondary/80'
                }`}
              >
                <ChevronIcon className="w-4 h-4 -rotate-90" /> Prev
              </button>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className={`px-3 py-1 rounded-pill flex items-center gap-1 bg-bg-secondary text-sm ${
                  page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bg-secondary/80'
                }`}
              >
                Next <ChevronIcon className="w-4 h-4 rotate-90" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AnalyticsPanel
