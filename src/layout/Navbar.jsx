// src/layout/Navbar.jsx

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b-2 border-b-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-blue-500 text-2xl font-bold">
          Pomodoro Roulette
        </a>
      </div>
    </nav>
  );
}