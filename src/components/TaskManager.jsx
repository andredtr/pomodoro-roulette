import { useState } from 'react'

function TaskManager({ tasks, onAddTask, onDeleteTask }) {
  const [newTask, setNewTask] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      onAddTask(newTask.trim())
      setNewTask('')
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-100">Task Manager</h2>
      
      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-300 mb-2">Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-400 italic">No tasks yet. Add some tasks to get started!</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
              >
                  <span className="text-gray-100">{task.text}</span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TaskManager 
