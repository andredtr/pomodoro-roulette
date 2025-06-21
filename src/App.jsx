import { useState, useEffect } from "react";
import TaskManager from "./components/TaskManager";
import RouletteWheel from "./components/RouletteWheel";
import TomatoIcon from "./components/icons/TomatoIcon";

function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      createdAt: new Date(),
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

  const handleTaskCompleted = (taskId) => {
    deleteTask(taskId);
  };

  return (
    <>
      <main className="min-h-screen bg-bg-outer">
        <div className="max-w-5xl mx-auto p-4 ">
          <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-2">
              <TomatoIcon className="w-8 h-8" />
              <h1 className="text-5xl font-semibold tracking-tight">Pomodoro Roulette</h1>
            </div>
            <p className="text-sm max-w-xl mx-auto text-white/60">
              Add your tasks and let the wheel decide what to work on next!
            </p>
            <div className="mt-8 h-px bg-white/20"></div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Left Side - Task Manager */}
           <div className="order-2 lg:order-1 lg:col-span-4">
             <TaskManager
               tasks={tasks}
               onAddTask={addTask}
               onDeleteTask={deleteTask}
             />
           </div>

           {/* Right Side - Roulette Wheel */}
           <div className="order-1 lg:order-2 lg:col-span-8">
             <RouletteWheel
               tasks={tasks}
               onTaskSelected={handleTaskSelected}
               onTaskCompleted={handleTaskCompleted}
             />
           </div>
         </div>
        </div>
      </main>
    </>
  );
}

export default App;
