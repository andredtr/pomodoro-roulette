import PlayIcon from './icons/PlayIcon'
import TrashIcon from './icons/TrashIcon'

function TaskItem({
  task,
  onStartTimer,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.text}"?`)) {
      onDeleteTask(task.id)
    }
  }

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className="flex items-center justify-between p-3 bg-bg-secondary rounded-md cursor-move"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-text-primary truncate">{task.text}</span>
        <span className="text-accent-success text-sm whitespace-nowrap">{task.pomodoros} 🍅</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label={`Start timer for task '${task.text}'`}
          title="Start timer"
          onClick={() => onStartTimer(task.id)}
          className="p-1 text-text-primary/70 hover:text-accent-success"
        >
          <PlayIcon className="w-5 h-5" />
        </button>
        <button
          aria-label={`Delete task '${task.text}'`}
          title="Delete task"
          onClick={handleDelete}
          className="p-1 text-text-primary/70 hover:text-accent-primary"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  )
}

export default TaskItem
