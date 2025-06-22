import TomatoIcon from './icons/TomatoIcon'

function Analytics({ analytics }) {
  const today = new Date().toISOString().slice(0, 10)
  const todayCount = analytics.dailyPomodoros[today] || 0

  return (
    <div className="bg-bg-card rounded-md shadow-lg p-6">
      <h2 className="mb-4">Analytics</h2>
      <p className="mb-4 flex items-center gap-2">
        <TomatoIcon className="w-5 h-5" />
        <span>Pomodoros today: {todayCount}</span>
      </p>
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-300 mb-2">Completed Tasks</h3>
        {analytics.completedTasks.length === 0 ? (
          <p className="text-gray-400 italic">No tasks completed yet.</p>
        ) : (
          <ul className="space-y-1 max-h-[200px] overflow-y-auto">
            {analytics.completedTasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center p-2 bg-bg-secondary rounded-md"
              >
                <span className="truncate" title={task.text}>{task.text}</span>
                <span className="text-sm text-white/70 whitespace-nowrap">
                  {task.pomodoros} 🍅
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Analytics
