import { useState } from 'react'
import TrashIcon from './icons/TrashIcon'
import PlayIcon from './icons/PlayIcon'

function TaskManager({ tasks, onAddTask, onDeleteTask, onStartTimer }) {
  const [newTask, setNewTask] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      onAddTask(newTask.trim())
      setNewTask('')
    }
  }

  return (
    <div className="bg-bg-card rounded-md shadow-lg p-6 relative z-10">
      <h2 className="mb-4">Task Manager</h2>
      
      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 min-w-0 px-4 py-2 bg-bg-secondary placeholder-white/40 text-text-primary rounded-pill focus:outline-none focus:ring-2 focus:ring-accent-info"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-accent-primary text-white rounded-pill hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors whitespace-nowrap"
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
                className="flex items-center justify-between p-3 bg-bg-secondary rounded-md"
              >
                <span className="text-text-primary truncate">{task.text}</span>
                <div className="flex items-center gap-2">
                  {onStartTimer && (
                    <button
                      aria-label={`Start timer for task '${task.text}'`}
                      onClick={() => onStartTimer(task)}
                      className="p-1 text-text-primary/70 hover:text-green-400"
                    >
                      <PlayIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    aria-label={`Delete task '${task.text}'`}
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 text-text-primary/70 hover:text-accent-primary"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TaskManager 
