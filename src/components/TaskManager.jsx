import { useState } from 'react'
import trash from '../assets/trash.svg'

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
    <div className="bg-[#161B22] rounded-[12px] shadow-lg p-6">
      <h2 className="text-[24px] font-semibold mb-4 text-white">Task Manager</h2>
      
      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-gray-100 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#FF5B57] text-white rounded-full hover:bg-[#e04e4a] focus:outline-none focus:ring-2 focus:ring-[#FF5B57] focus:ring-offset-2 transition-colors font-medium"
          >
            Add
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
        <h3 className="font-semibold text-gray-300 mb-2">Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-400 italic">No tasks yet. Add some tasks to get started!</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 bg-[#1E232F] rounded-[8px] border border-gray-600 hover:-translate-y-px hover:shadow-md transition"
              >
                  <span className="text-gray-100">{task.text}</span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 rounded-full hover:bg-[#FF5B57]/20 text-[#FF5B57] focus:outline-none"
                  aria-label={`Delete task ${task.text}`}
                >
                  <img src={trash} alt="delete" className="w-5 h-5" />
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
