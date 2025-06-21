import { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import TaskManager from "./components/TaskManager";
import RouletteWheel from "./components/RouletteWheel";

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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-4 ">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🍅 Pomodoro Roulette
            </h1>
            <p className="text-gray-600">
              Add your tasks and let the wheel decide what to work on next!
            </p>
          </div>

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
