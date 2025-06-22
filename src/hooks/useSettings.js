import useLocalStorage from './useLocalStorage'

export default function useSettings() {
  const [settings, setSettings] = useLocalStorage('rouletteSettings', {
    soundsEnabled: true,
    pomodoroDuration: 25,
  })

  const setSoundsEnabled = (enabled) => {
    setSettings((prev) => ({ ...prev, soundsEnabled: enabled }))
  }

  const setPomodoroDuration = (duration) => {
    setSettings((prev) => ({ ...prev, pomodoroDuration: duration }))
  }

  return {
    soundsEnabled: settings.soundsEnabled,
    pomodoroDuration: settings.pomodoroDuration,
    setSoundsEnabled,
    setPomodoroDuration,
  }
}
