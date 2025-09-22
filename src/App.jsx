import KanbanBoard from "./components/KanbanBoard"
import "./App.css"

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>HexaSynergy Kanban Board</h1>
      </header>
      <main>
        <KanbanBoard />
      </main>
    </div>
  )
}

export default App
