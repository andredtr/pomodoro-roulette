import React from 'react'

function Analytics({ analytics }) {
  const { tasksCompleted, history } = analytics

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Analytics</h2>
      <p className="mb-4 text-gray-700">Tasks completed: {tasksCompleted}</p>
      {history.length === 0 ? (
        <p className="text-gray-500 italic">No tasks completed yet.</p>
      ) : (
        <ul className="space-y-1">
          {history.map((item, index) => (
            <li
              key={index}
              className="flex justify-between border-b border-gray-200 pb-1 text-sm"
            >
              <span className="text-gray-800 truncate">{item.text}</span>
              <span className="text-gray-600">{item.pomodoros} Pomodoros</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Analytics
