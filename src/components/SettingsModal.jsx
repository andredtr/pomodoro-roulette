import { useState } from 'react'

function SettingsModal({ initialSoundsEnabled, initialPomodoroDuration, onSave, onClose }) {
  const [sounds, setSounds] = useState(initialSoundsEnabled)
  const [duration, setDuration] = useState(initialPomodoroDuration)

  const handleSave = () => {
    onSave({ soundsEnabled: sounds, pomodoroDuration: duration })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-bg-card p-6 rounded-md w-80">
        <h2 className="text-xl mb-4">Settings</h2>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sounds}
              onChange={(e) => setSounds(e.target.checked)}
            />
            <span>Enable Sounds</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Pomodoro Duration (minutes)</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-2 py-1 rounded bg-bg-secondary"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-bg-secondary text-white rounded hover:bg-bg-secondary/80"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent-primary text-white rounded hover:bg-red-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
