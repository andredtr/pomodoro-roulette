import { useState } from 'react'
import TaskItem from './TaskItem'

function TaskManager({ tasks, onAddTask, onDeleteTask, onStartTimer, onReorderTasks }) {
  const [newTask, setNewTask] = useState('')
  const [dragIndex, setDragIndex] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTask.trim()) {
      onAddTask(newTask.trim())
      setNewTask('')
    }
  }

  const handleDragStart = (index) => () => {
    setDragIndex(index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (index) => (e) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    onReorderTasks(dragIndex, index)
    setDragIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
  }

  return (
    <div className="bg-bg-card rounded-md shadow-lg p-6 relative z-10">
      <h2 className="mb-4">Create your tasks</h2>
      
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
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                onStartTimer={onStartTimer}
                onDeleteTask={onDeleteTask}
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={handleDrop(index)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TaskManager 
