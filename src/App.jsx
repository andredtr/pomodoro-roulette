import { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import TaskManager from "./components/TaskManager";
import RouletteWheel from "./components/RouletteWheel";
import AnalyticsPanel from "./components/AnalyticsPanel";
import TomatoIcon from "./components/icons/TomatoIcon";

function App() {
  const currentDate = new Date().toISOString().split('T')[0];

  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [completedTasks, setCompletedTasks] = useLocalStorage('completedTasks', []);
  const [dailyData, setDailyData] = useLocalStorage('dailyPomodoros', { date: currentDate, count: 0 });
  const dailyPomodoros = dailyData.date === currentDate ? dailyData.count : 0;
  const setDailyPomodoros = (updater) => {
    setDailyData(prev => {
      const currentCount = prev.date === currentDate ? prev.count : 0;
      const nextCount = typeof updater === 'function' ? updater(currentCount) : updater;
      return { date: currentDate, count: nextCount };
    });
  };
  const [selectedTask, setSelectedTask] = useState(null);
  const [startTaskId, setStartTaskId] = useState(null);

  useEffect(() => {
    setTasks(prev => prev.map(t => ({ pomodoros: t.pomodoros || 0, ...t })))
  }, [])

  useEffect(() => {
    try {
      const hasUsedApp = localStorage.getItem('hasUsedApp')
      if (!hasUsedApp) {
        if (tasks.length === 0) {
          const now = Date.now()
          const placeholders = [
            { id: now, text: 'Learn how to use the app.', createdAt: new Date(), pomodoros: 0 },
            { id: now + 1, text: 'Delete these placeholder tasks.', createdAt: new Date(), pomodoros: 0 },
          ]
          setTasks(placeholders)
        }
        localStorage.setItem('hasUsedApp', 'true')
      }
    } catch {
      // ignore localStorage errors
    }
  }, [])


  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      createdAt: new Date(),
      pomodoros: 0,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    // If the deleted task was selected, clear the selection
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  const handleTaskSelected = (task) => {
    setSelectedTask(task);
  };

  const startTaskTimer = (taskId) => {
    setStartTaskId(taskId);
  };

  const handlePomodoroComplete = (taskId) => {
    setDailyPomodoros((p) => p + 1);
    setTasks((prev) => prev.map(t => t.id === taskId ? { ...t, pomodoros: (t.pomodoros || 0) + 1 } : t));
  };

  const handleTaskCompleted = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setCompletedTasks((prev) => [...prev, { ...task, completedAt: new Date() }]);
    }
    deleteTask(taskId);
  };

  const reorderTasks = (from, to) => {
    setTasks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  return (
    <>
      <main className="min-h-screen bg-bg-outer">
        <div className="max-w-7xl mx-auto p-4 ">
          <header className="text-center mb-8 mt-4">
            <div className="flex justify-center items-center gap-2 mb-2">
              <TomatoIcon className="w-12 h-12" />
              <h1 className="text-5xl font-semibold tracking-tight">Pomodoro Roulette</h1>
            </div>
            <p className="text-sm max-w-xl mx-auto text-white/60">
              Add your tasks and let the wheel decide what to work on next!
            </p>
            <div className="mt-8 h-px bg-white/20"></div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Left Side - Task Manager */}
           <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col gap-6">
           <TaskManager
              tasks={tasks}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onStartTimer={startTaskTimer}
              onReorderTasks={reorderTasks}
            />
           <AnalyticsPanel completedTasks={completedTasks} dailyPomodoros={dailyPomodoros} />
           </div>

           {/* Right Side - Roulette Wheel */}
           <div className="order-1 lg:order-2 lg:col-span-8">
           <RouletteWheel
              tasks={tasks}
              onTaskSelected={handleTaskSelected}
              onTaskCompleted={handleTaskCompleted}
              onPomodoroComplete={handlePomodoroComplete}
              startTaskId={startTaskId}
              onStartTaskConsumed={() => setStartTaskId(null)}
            />
           </div>
         </div>
        </div>
      </main>
    </>
  );
}

export default App;
