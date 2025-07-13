import { useState, useRef, useEffect, useCallback } from 'react'
import DiceIcon from './icons/DiceIcon'
import ChevronIcon from './icons/ChevronIcon'
import SettingsIcon from './icons/SettingsIcon'
import SettingsModal from './SettingsModal'
import PomodoroTimer from './PomodoroTimer'
import BreakTimer from './BreakTimer'
import TimerProgressBar from './TimerProgressBar'
import useSettings from '../hooks/useSettings'
import WheelCanvas from './WheelCanvas'

function RouletteWheel({ tasks, onTaskSelected, onTaskCompleted, onPomodoroComplete, startTaskId, onStartTaskConsumed }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const wheelRef = useRef(null)
  const spinSoundRef = useRef(null)
  const rotationRef = useRef(0)

  const [showSettings, setShowSettings] = useState(false)
  const {
    soundsEnabled,
    pomodoroDuration,
    breakDuration,
    setSoundsEnabled,
    setPomodoroDuration,
    setBreakDuration,
  } = useSettings()

  const [timeLeft, setTimeLeft] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const [breakTimeLeft, setBreakTimeLeft] = useState(0)
  const [breakTimerStarted, setBreakTimerStarted] = useState(false)
  const [breakPaused, setBreakPaused] = useState(false)

  const intervalRef = useRef(null)

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resetTimer = useCallback(() => {
    clearTimerInterval()
    setTimeLeft(0)
    setTimerStarted(false)
    setIsPaused(false)
  }, [clearTimerInterval])

  const resetBreakTimer = useCallback(() => {
    clearTimerInterval()
    setBreakTimeLeft(0)
    setBreakTimerStarted(false)
    setBreakPaused(false)
  }, [clearTimerInterval])

  const pomodoroCompletion = useCallback(() => {
    document.title = 'Pomodoro Roulette - Timer Complete!'
    playCompletionSound()
    if (onPomodoroComplete && selectedTask) {
      onPomodoroComplete(selectedTask.id)
    }
    setBreakAvailable(true)
    clearActivePomodoro()
    resetTimer()
  }, [onPomodoroComplete, selectedTask, resetTimer])

  const breakCompletion = useCallback(() => {
    document.title = 'Pomodoro Roulette - Break Complete!'
    setBreakAvailable(false)
    resetBreakTimer()
  }, [resetBreakTimer])

  useEffect(() => {
    if ((timerStarted && !isPaused) || (breakTimerStarted && !breakPaused)) {
      intervalRef.current = setInterval(() => {
        if (timerStarted && !isPaused) {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              pomodoroCompletion()
              return 0
            }
            return prev - 1
          })
        } else if (breakTimerStarted && !breakPaused) {
          setBreakTimeLeft((prev) => {
            if (prev <= 1) {
              breakCompletion()
              return 0
            }
            return prev - 1
          })
        }
      }, 1000)
    } else {
      clearTimerInterval()
    }

    return () => clearTimerInterval()
  }, [timerStarted, isPaused, breakTimerStarted, breakPaused, pomodoroCompletion, breakCompletion, clearTimerInterval])

  const startTimer = useCallback((minutes) => {
    resetBreakTimer()
    setBreakAvailable(false)
    setTimeLeft(minutes * 60)
    setTimerStarted(true)
    setIsPaused(false)
  }, [resetBreakTimer])

  const pauseTimer = useCallback(() => setIsPaused(true), [])
  const resumeTimer = useCallback(() => setIsPaused(false), [])

  const startBreakTimer = useCallback((minutes) => {
    resetTimer()
    clearActivePomodoro()
    setBreakTimeLeft(minutes * 60)
    setBreakTimerStarted(true)
    setBreakPaused(false)
  }, [resetTimer])

  const pauseBreakTimer = useCallback(() => setBreakPaused(true), [])
  const resumeBreakTimer = useCallback(() => setBreakPaused(false), [])

  const [breakAvailable, setBreakAvailable] = useState(false)

  const recordActivePomodoro = useCallback((taskId, startTime = Date.now(), duration = pomodoroDuration) => {
    try {
      localStorage.setItem('activePomodoro', JSON.stringify({ taskId, startTime, duration }))
    } catch {
      // ignore write errors
    }
  }, [pomodoroDuration])

  const clearActivePomodoro = () => {
    try {
      localStorage.removeItem('activePomodoro')
    } catch {
      // ignore remove errors
    }
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem('activePomodoro')
      if (!stored) return
      const { taskId, startTime, duration } = JSON.parse(stored)
      const task = tasks.find(t => t.id === taskId)
      if (!task) {
        clearActivePomodoro()
        return
      }
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = duration * 60 - elapsed
      if (remaining > 0) {
        setSelectedTask(task)
        setTimeLeft(remaining)
        setTimerStarted(true)
        if (onTaskSelected) onTaskSelected(task)
      } else {
        clearActivePomodoro()
      }
    } catch {
      // ignore read errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]

  useEffect(() => {
    if (!startTaskId) return
    const task = tasks.find(t => t.id === startTaskId)
    if (task) {
      setSelectedTask(task)
      startTimer(pomodoroDuration)
      recordActivePomodoro(task.id)
      if (onTaskSelected) onTaskSelected(task)
    }
    if (onStartTaskConsumed) onStartTaskConsumed()
  }, [startTaskId, tasks, pomodoroDuration, onStartTaskConsumed, onTaskSelected, startTimer, recordActivePomodoro])

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const playSpinningSound = () => {
    if (!soundsEnabled) return
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // iOS requires the context to be resumed after a user interaction
      const resumePromise = audioContext.resume?.() || Promise.resolve()

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

      const playFinalTick = (startTime) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(600, startTime)
        oscillator.type = 'square'

        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

        oscillator.start(startTime)
        oscillator.stop(startTime + 0.2)
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
        } else {
          playFinalTick(startTime + duration / 1000)
        }
      }

      resumePromise.then(scheduleNextTick)

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
    if (!soundsEnabled) return
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()

      // Ensure the context is running (important for iOS)
      const resumePromise = audioContext.resume?.() || Promise.resolve()

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1)

      resumePromise.then(() => {
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 1)
      })

    } catch (error) {
      console.log('Audio not supported:', error)
      // Fallback: try to use system bell
      console.log('\u0007') // Bell character
    }
  }

  const startTimerHandler = () => {
    if (!selectedTask) return
    startTimer(pomodoroDuration)
    recordActivePomodoro(selectedTask.id)
  }

  const completeTask = () => {
    if (!selectedTask) return

    const confirmed = window.confirm(
      `Are you sure you want to complete the task: "${selectedTask.text}"?\n\nThis will remove the task from your list and reset the timer.`,
    )

    if (confirmed) {
      const wasPomodoroStarted = timerStarted || timeLeft > 0
      if (wasPomodoroStarted && onPomodoroComplete) {
        onPomodoroComplete(selectedTask.id)
      }
      resetTimer()
      clearActivePomodoro()
      setSelectedTask(null)
      setBreakAvailable(true)
      if (onTaskCompleted) {
        onTaskCompleted(selectedTask.id)
      }
    }
  }

  useEffect(() => {
    if (breakTimeLeft > 0 && breakTimerStarted) {
      document.title = `${formatTime(breakTimeLeft)} Break - Pomodoro Roulette`
    } else if (timeLeft > 0 && selectedTask) {
      document.title = `${formatTime(timeLeft)} Pomodoro Roulette`
    } else if (timeLeft === 0 && !timerStarted && breakTimeLeft === 0) {
      document.title = 'Pomodoro Roulette'
    }
  }, [timeLeft, selectedTask, timerStarted, breakTimeLeft, breakTimerStarted])

  const spin = () => {
    if (tasks.length === 0 || isSpinning) return

    // Clear any existing timers and reset all state
    resetTimer()
    resetBreakTimer()
    setBreakAvailable(false)
    clearActivePomodoro()
    stopSpinningSound() // Stop any existing spinning sound
    setIsSpinning(true)
    setSelectedTask(null)
    document.title = 'Pomodoro Roulette'

    // Start spinning sound
    playSpinningSound()

    // Random rotation between 2160 and 3600 degrees (6-10 full rotations)
    const minRotation = 2160
    const maxRotation = 3600
    const additionalRotation = Math.random() * (maxRotation - minRotation) + minRotation

    // Normalize current rotation to avoid huge accumulated values
    const currentRotation = rotationRef.current % 360
    const rotation = currentRotation + additionalRotation

    // Calculate which task will be selected
    const degreesPerTask = 360 / tasks.length
    const normalizedRotation = rotation % 360
    const pointerAngle = 270
    const relativeRotation = (pointerAngle - normalizedRotation + 360) % 360
    const selectedIndex = Math.floor(relativeRotation / degreesPerTask) % tasks.length

    // Update stored rotation so subsequent spins start from current position
    rotationRef.current = rotation

    if (wheelRef.current) {
      // Reset to normalized rotation instantly
      wheelRef.current.style.transition = 'none'
      wheelRef.current.style.transform = `rotate(${currentRotation}deg)`
      // Force reflow to apply the immediate transform
      // eslint-disable-next-line no-unused-expressions
      wheelRef.current.getBoundingClientRect()
      // Apply the spin with smooth transition
      wheelRef.current.style.transition = 'transform 4s ease-out'
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

  return (
    <>
    {(timerStarted || breakTimerStarted) && (
      <TimerProgressBar
        timeLeft={timerStarted ? timeLeft : breakTimeLeft}
        totalTime={(timerStarted ? pomodoroDuration : breakDuration) * 60}
        mode={timerStarted ? 'task' : 'break'}
      />
    )}
    <div className="bg-bg-card rounded-md shadow-lg px-6 py-12 relative">
      <button
        aria-label="Settings"
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 text-white hover:text-accent-info"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>
      <h2 className="mb-6 text-center">Task Wheel</h2>

      {tasks.length < 2 ? (
        <div className="flex flex-col items-center justify-center mb-6 h-96">
          <div className="text-6xl mb-4">🎯</div>
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-center">Add some tasks to start spinning the wheel!</p>
          ) : (
            <p className="text-gray-400 text-center">
              You have {tasks.length} task. Add at least one more task to spin the wheel!
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Wheel Container */}
          <div className="relative flex justify-center mb-6">
            <div className="relative">
              {/* Pointer */}
              <div 
                className={`absolute -top-5 left-1/2 z-10 text-accent-primary transition-all duration-200 ${
                  isSpinning ? 'animate-paper-flutter' : 'animate-paper-idle'
                }`}
                style={{
                  filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.6)) drop-shadow(0px 0px 2px rgba(0,0,0,0.8))',
                  transform: 'translateX(-50%)'
                }}
              >
                <ChevronIcon className="w-10 h-10 stroke-2" style={{ stroke: 'rgba(0,0,0,0.4)', strokeWidth: '1px' }} />
              </div>

              {/* Wheel */}
              <div ref={wheelRef} className="transition-transform duration-[4000ms] ease-out">
                <WheelCanvas tasks={tasks} colors={colors} />
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center mb-4">
            <button
              onClick={spin}
              disabled={isSpinning || timerStarted}
              className={`px-8 h-12 rounded-pill inline-flex items-center justify-center gap-2 font-medium transition-all ${
                isSpinning || timerStarted
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-accent-success to-green-700 hover:brightness-110 active:brightness-90'
              } text-white focus:outline-none focus:ring-2 focus:ring-accent-success`}
            >
              {isSpinning ? (
                'Spinning...'
              ) : (
                <>
                  <DiceIcon className="w-5 h-5" />
                  <span>Spin the Wheel</span>
                </>
              )}
            </button>
          </div>
        </>
      )}

      <PomodoroTimer
        selectedTask={selectedTask}
        timeLeft={timeLeft}
        timerStarted={timerStarted}
        isPaused={isPaused}
        pomodoroDuration={pomodoroDuration}
        onStartTimer={startTimerHandler}
        onPauseTimer={pauseTimer}
        onResumeTimer={resumeTimer}
        onCompleteTask={completeTask}
      />
      {(breakAvailable || breakTimerStarted) && (
        <BreakTimer
          timeLeft={breakTimeLeft}
          timerStarted={breakTimerStarted}
          isPaused={breakPaused}
          breakDuration={breakDuration}
          onStartBreak={() => {
            startBreakTimer(breakDuration)
          }}
          onPauseBreak={pauseBreakTimer}
          onResumeBreak={resumeBreakTimer}
          onEndBreak={() => {
            resetBreakTimer()
            setBreakAvailable(false)
          }}
        />
      )}
    </div>
    {showSettings && (
      <SettingsModal
        initialSoundsEnabled={soundsEnabled}
        initialPomodoroDuration={pomodoroDuration}
        initialBreakDuration={breakDuration}
        onSave={({ soundsEnabled: se, pomodoroDuration: pd, breakDuration: bd }) => {
          setSoundsEnabled(se)
          setPomodoroDuration(pd)
          setBreakDuration(bd)
        }}
        onClose={() => setShowSettings(false)}
      />
    )}
    </>
  )
}

export default RouletteWheel
