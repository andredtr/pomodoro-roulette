import useLocalStorage from './useLocalStorage'

export default function useSettings() {
  const [settings, setSettings] = useLocalStorage('rouletteSettings', {
    soundsEnabled: true,
    pomodoroDuration: 25,
    breakDuration: 5,
  })

  const setSoundsEnabled = (enabled) => {
    setSettings((prev) => ({ ...prev, soundsEnabled: enabled }))
  }

  const setPomodoroDuration = (duration) => {
    setSettings((prev) => ({ ...prev, pomodoroDuration: duration }))
  }

  const setBreakDuration = (duration) => {
    setSettings((prev) => ({ ...prev, breakDuration: duration }))
  }

  return {
    soundsEnabled: settings.soundsEnabled,
    pomodoroDuration: settings.pomodoroDuration,
    breakDuration: settings.breakDuration,
    setSoundsEnabled,
    setPomodoroDuration,
    setBreakDuration,
  }
}
