import { useState } from 'react'
import TrashIcon from './icons/TrashIcon'

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
    <div className="bg-bgCard rounded-md shadow-lg p-6">
      <h2 className="mb-4">Task Manager</h2>
      
      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-2 bg-bgSecondary placeholder-white/40 text-textPrimary rounded-pill focus:outline-none focus:ring-2 focus:ring-accentInfo"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-accentPrimary text-white rounded-pill hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-accentPrimary transition-colors"
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
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-bgSecondary rounded-md"
              >
                <span className="text-textPrimary truncate">{task.text}</span>
                <button
                  aria-label={`Delete task '${task.text}'`}
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 text-textPrimary/70 hover:text-accentPrimary"
                >
                  <TrashIcon className="w-5 h-5" />
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
