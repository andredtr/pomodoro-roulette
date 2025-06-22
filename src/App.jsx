import { useState, useEffect } from "react";
import TaskManager from "./components/TaskManager";
import RouletteWheel from "./components/RouletteWheel";
import Analytics from "./components/Analytics";
import TomatoIcon from "./components/icons/TomatoIcon";

function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.map(t => ({ ...t, pomodoros: t.pomodoros || 0 }));
  });
  const [analytics, setAnalytics] = useState(() => {
    const stored = localStorage.getItem('analytics');
    return stored ? JSON.parse(stored) : { completedTasks: [], dailyPomodoros: {} };
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [startTaskId, setStartTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('analytics', JSON.stringify(analytics));
  }, [analytics]);

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
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, pomodoros: (t.pomodoros || 0) + 1 } : t));
    const today = new Date().toISOString().slice(0,10);
    setAnalytics(prev => ({
      ...prev,
      dailyPomodoros: { ...prev.dailyPomodoros, [today]: (prev.dailyPomodoros[today] || 0) + 1 }
    }));
  };

  const handleTaskCompleted = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setAnalytics(prev => ({
        ...prev,
        completedTasks: [...prev.completedTasks, {
          id: task.id,
          text: task.text,
          pomodoros: task.pomodoros,
          completedAt: new Date(),
        }]
      }));
    }
    deleteTask(taskId);
  };

  return (
    <>
      <main className="min-h-screen bg-bg-outer">
        <div className="max-w-7xl mx-auto p-4 ">
          <header className="text-center mb-8">
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
           <div className="order-2 lg:order-1 lg:col-span-4 space-y-6">
           <TaskManager
              tasks={tasks}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onStartTimer={startTaskTimer}
            />
            <Analytics analytics={analytics} />
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
