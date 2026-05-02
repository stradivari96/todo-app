import Board from './components/Board/Board'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-2.5 bg-black/20 backdrop-blur-sm shrink-0">
        <h1 className="text-white font-bold text-lg tracking-wide">My Board</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <Board />
      </main>
    </div>
  )
}
