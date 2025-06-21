import { useState, useRef, useEffect } from 'react'

function RouletteWheel({ tasks, onTaskSelected, onTaskCompleted }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const wheelRef = useRef(null)
  const timerRef = useRef(null)

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const startTimer = () => {
    setTimeLeft(25 * 60)
  }

  const completeTask = () => {
    if (!selectedTask) return
    
    const confirmed = window.confirm(`Are you sure you want to complete the task: "${selectedTask.text}"?\n\nThis will remove the task from your list and reset the timer.`)
    
    if (confirmed) {
      // Reset timer and clear selected task
      setTimeLeft(0)
      setSelectedTask(null)
      clearTimeout(timerRef.current)
      
      // Call parent callback to remove the task
      if (onTaskCompleted) {
        onTaskCompleted(selectedTask.id)
      }
    }
  }

  useEffect(() => {
    if (timeLeft > 0) {
      document.title = `${formatTime(timeLeft)} Pomodoro Roulette`
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else {
      document.title = 'Pomodoro Roulette'
      clearTimeout(timerRef.current)
    }
    return () => clearTimeout(timerRef.current)
  }, [timeLeft])

  const spin = () => {
    if (tasks.length === 0 || isSpinning) return

    setIsSpinning(true)
    setSelectedTask(null)
    setTimeLeft(0)

    // Random rotation between 2160 and 3600 degrees (6-10 full rotations)
    const minRotation = 2160
    const maxRotation = 3600
    const rotation = Math.random() * (maxRotation - minRotation) + minRotation

    // Calculate which task will be selected
    const degreesPerTask = 360 / tasks.length
    const normalizedRotation = rotation % 360
    const selectedIndex = Math.floor((360 - normalizedRotation) / degreesPerTask) % tasks.length
    
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${rotation}deg)`
    }

    // After animation completes
    setTimeout(() => {
      setIsSpinning(false)
      const selected = tasks[selectedIndex]
      setSelectedTask(selected)
      onTaskSelected(selected)
    }, 4000)
  }

  if (tasks.length < 2) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center h-96">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">Pomodoro Roulette</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">Add some tasks to start spinning the wheel!</p>
        ) : (
          <p className="text-gray-500 text-center">
            You have {tasks.length} task. Add at least one more task to spin the wheel!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Pomodoro Roulette</h2>
      
      {/* Wheel Container */}
      <div className="relative flex justify-center mb-6">
        <div className="relative">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
          
          {/* Wheel */}
          <div 
            ref={wheelRef}
            className="w-64 h-64 rounded-full border-4 border-gray-300 relative overflow-hidden transition-transform duration-4000 ease-out"
            style={{
              background: `conic-gradient(${tasks.map((task, index) => {
                const startAngle = (index * 360) / tasks.length
                const endAngle = ((index + 1) * 360) / tasks.length
                const color = colors[index % colors.length]
                return `${color} ${startAngle}deg ${endAngle}deg`
              }).join(', ')})`
            }}
          >
            {/* Task Labels */}
            {tasks.map((task, index) => {
              const degreesPerTask = 360 / tasks.length
              const angle = (index * degreesPerTask) + (degreesPerTask / 2)
              const radius = 85
              const x = Math.cos((angle - 90) * Math.PI / 180) * radius
              const y = Math.sin((angle - 90) * Math.PI / 180) * radius
              
              return (
                <div
                  key={task.id}
                  className="absolute text-white text-sm font-bold pointer-events-none select-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    maxWidth: '80px',
                    textAlign: 'center',
                    lineHeight: '1.1',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {task.text.length > 15 ? task.text.substring(0, 15) + '...' : task.text}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="text-center mb-4">
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`px-8 py-3 text-lg font-bold rounded-lg transition-all transform ${
            isSpinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95'
          } text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
        >
          {isSpinning ? 'Spinning...' : '🎲 SPIN THE WHEEL'}
        </button>
      </div>

      {/* Selected Task Display */}
      {selectedTask && (
        <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Selected Task:</h3>
          <p className="text-xl font-semibold text-green-700">{selectedTask.text}</p>
          {timeLeft === 0 ? (
            <>
              <p className="text-sm text-green-600 mt-2">Time for a 25-minute Pomodoro session!</p>
              <button
                onClick={startTimer}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Start Timer
              </button>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-green-700 mt-2">{formatTime(timeLeft)}</p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={completeTask}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  ✅ Complete Task
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default RouletteWheel
