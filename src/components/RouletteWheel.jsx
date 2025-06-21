import { useState, useRef, useEffect } from 'react'

function RouletteWheel({ tasks, onTaskSelected, onTaskCompleted }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const wheelRef = useRef(null)
  const timerRef = useRef(null)
  const spinSoundRef = useRef(null)
  const rotationRef = useRef(0)

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const playSpinningSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create a repeating tick sound that gets slower over time
      const playTick = (startTime) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Higher frequency for a clicking sound
        oscillator.frequency.setValueAtTime(800, startTime)
        oscillator.type = 'square'
        
        // Short, sharp sound
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.005)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + 0.05)
      }
      
      // Create a series of ticks that slow down over 4 seconds
      const duration = 4000 // 4 seconds
      const startTime = audioContext.currentTime
      let currentTime = 0
      let tickInterval = 50 // Start with 50ms between ticks
      
      const scheduleNextTick = () => {
        if (currentTime < duration) {
          playTick(startTime + currentTime / 1000)
          currentTime += tickInterval
          // Gradually increase interval to slow down the ticking
          tickInterval = Math.min(tickInterval * 1.02, 200)
          setTimeout(scheduleNextTick, 1)
        }
      }
      
      scheduleNextTick()
      
      // Store reference to stop if needed
      spinSoundRef.current = { audioContext, duration }
      
    } catch (error) {
      console.log('Spinning sound not supported:', error)
    }
  }

  const stopSpinningSound = () => {
    if (spinSoundRef.current?.audioContext) {
      try {
        spinSoundRef.current.audioContext.close()
      } catch (error) {
        console.log('Error stopping spinning sound:', error)
      }
      spinSoundRef.current = null
    }
  }

  const playCompletionSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create a triumphant "tadah" fanfare sound
      const playNote = (frequency, startTime, duration, volume = 0.2) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(frequency, startTime)
        oscillator.type = 'sawtooth' // Richer, more fanfare-like sound
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }
      
      // Create chord progression for "tadah" effect
      const now = audioContext.currentTime
      
      // Opening chord (C major) - quick stab
      playNote(261.63, now, 0.15, 0.15) // C4
      playNote(329.63, now, 0.15, 0.12) // E4
      playNote(392.00, now, 0.15, 0.12) // G4
      
      // Rising glissando effect
      playNote(523.25, now + 0.2, 0.3, 0.2) // C5
      playNote(587.33, now + 0.35, 0.3, 0.18) // D5
      playNote(659.25, now + 0.5, 0.4, 0.22) // E5
      
      // Final triumphant chord (C major octave higher) - "TADAH!"
      playNote(523.25, now + 0.8, 0.8, 0.25) // C5
      playNote(659.25, now + 0.8, 0.8, 0.2)  // E5
      playNote(783.99, now + 0.8, 0.8, 0.2)  // G5
      playNote(1046.5, now + 0.8, 0.8, 0.15) // C6
      
    } catch (error) {
      console.log('Audio not supported:', error)
      // Fallback: try to use system bell
      console.log('\u0007') // Bell character
    }
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
    // Clear any existing timeout first
    clearTimeout(timerRef.current)
    
    if (timeLeft > 0 && selectedTask) {
      document.title = `${formatTime(timeLeft)} Pomodoro Roulette`
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0 && selectedTask) {
      // Timer just completed - play sound only once
      document.title = 'Pomodoro Roulette - Timer Complete!'
      playCompletionSound()
    } else {
      document.title = 'Pomodoro Roulette'
    }
    
    return () => clearTimeout(timerRef.current)
  }, [timeLeft, selectedTask])

  const spin = () => {
    if (tasks.length === 0 || isSpinning) return

    // Clear any existing timers and reset all state
    clearTimeout(timerRef.current)
    stopSpinningSound() // Stop any existing spinning sound
    setIsSpinning(true)
    setSelectedTask(null)
    setTimeLeft(0)
    document.title = 'Pomodoro Roulette'

    // Start spinning sound
    playSpinningSound()

    // Random rotation between 2160 and 3600 degrees (6-10 full rotations)
    const minRotation = 2160
    const maxRotation = 3600
    const additionalRotation = Math.random() * (maxRotation - minRotation) + minRotation
    const rotation = rotationRef.current + additionalRotation

    // Calculate which task will be selected
    const degreesPerTask = 360 / tasks.length
    const normalizedRotation = rotation % 360
    const selectedIndex = Math.floor((360 - normalizedRotation) / degreesPerTask) % tasks.length

    // Update stored rotation so subsequent spins start from current position
    rotationRef.current = rotation
    
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${rotation}deg)`
    }

    // After animation completes
    setTimeout(() => {
      setIsSpinning(false)
      stopSpinningSound() // Stop spinning sound when wheel stops
      const selected = tasks[selectedIndex]
      setSelectedTask(selected)
      onTaskSelected(selected)
    }, 4000)
  }

  if (tasks.length < 2) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center h-96">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-xl font-bold mb-2 text-gray-100">Pomodoro Roulette</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center">Add some tasks to start spinning the wheel!</p>
        ) : (
          <p className="text-gray-400 text-center">
            You have {tasks.length} task. Add at least one more task to spin the wheel!
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-100 text-center">Pomodoro Roulette</h2>
      
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
            className="w-64 h-64 rounded-full border-4 border-gray-600 relative overflow-hidden transition-transform duration-4000 ease-out"
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
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95'
          } text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
        >
          {isSpinning ? 'Spinning...' : '🎲 SPIN THE WHEEL'}
        </button>
      </div>

      {/* Selected Task Display */}
      {selectedTask && (
        <div className="text-center p-4 bg-gray-700 rounded-lg border-2 border-green-500">
          <h3 className="text-lg font-bold text-green-400 mb-2">🎉 Selected Task:</h3>
          <p className="text-xl font-semibold text-green-300">{selectedTask.text}</p>
          {timeLeft === 0 ? (
            <>
              <p className="text-sm text-green-300 mt-2">Time for a 25-minute Pomodoro session!</p>
              <button
                onClick={startTimer}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Start Timer
              </button>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-green-300 mt-2">{formatTime(timeLeft)}</p>
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
