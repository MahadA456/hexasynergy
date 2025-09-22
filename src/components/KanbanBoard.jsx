
import { useState } from "react"
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column"
import "./KanbanBoard.css"

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    {
      id: "backlog",
      title: "Backlog",
      tasks: [
        { id: "task-1", title: "Create project structure" },
        { id: "task-2", title: "Setup development environment" },
      ],
    },
    {
      id: "in-development",
      title: "In Development",
      tasks: [{ id: "task-3", title: "Implement drag and drop" }],
    },
    {
      id: "review",
      title: "Review",
      tasks: [],
    },
    {
      id: "complete",
      title: "Complete",
      tasks: [{ id: "task-4", title: "Initial project setup" }],
    },
  ])


  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const addColumn = () => {
    const newColumn = {
      id: generateId(),
      title: "New Column",
      tasks: [],
    }
    setColumns([...columns, newColumn])
  }

  const renameColumn = (columnId, newTitle) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col)))
  }

  const deleteColumn = (columnId) => {
    setColumns(columns.filter((col) => col.id !== columnId))
  }

  const addTask = (columnId, taskTitle) => {
    const newTask = {
      id: generateId(),
      title: taskTitle,
    }

    setColumns(columns.map((col) => (col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col)))
  }

  const deleteTask = (columnId, taskId) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col,
      ),
    )
  }

  const renameTask = (columnId, taskId, newTitle) => {
    if (!newTitle || !newTitle.trim()) return
    setColumns(
      columns.map((col) => {
        if (col.id !== columnId) return col
        return {
          ...col,
          tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, title: newTitle.trim() } : t)),
        }
      }),
    )
  }

  const moveTaskToColumn = (sourceColumnId, targetColumnId, taskId) => {
    if (sourceColumnId === targetColumnId) return

    const sourceColumn = columns.find((col) => col.id === sourceColumnId)
    const destColumn = columns.find((col) => col.id === targetColumnId)
    if (!sourceColumn || !destColumn) return

    const taskToMove = sourceColumn.tasks.find((t) => t.id === taskId)
    if (!taskToMove) return

    const updatedSourceTasks = sourceColumn.tasks.filter((t) => t.id !== taskId)
    const updatedDestTasks = [...destColumn.tasks, taskToMove]

    const updatedColumns = columns.map((col) => {
      if (col.id === sourceColumnId) return { ...col, tasks: updatedSourceTasks }
      if (col.id === targetColumnId) return { ...col, tasks: updatedDestTasks }
      return col
    })

    setColumns(updatedColumns)
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    // If no destination, return
    if (!destination) return

    // If dropped in same position, return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)
    const draggedTask = sourceColumn.tasks.find((task) => task.id === draggableId)

    // Moving within same column
    if (source.droppableId === destination.droppableId) {
      const destColumnTitle = sourceColumn.title
      const userConfirmed = window.confirm(
        `Move task within "${destColumnTitle}" to position ${destination.index + 1}?`,
      )
      if (!userConfirmed) return
      const newTasks = Array.from(sourceColumn.tasks)
      newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, draggedTask)

      const newColumn = {
        ...sourceColumn,
        tasks: newTasks,
      }

      setColumns(columns.map((col) => (col.id === newColumn.id ? newColumn : col)))
    } else {
      // Moving between columns
      const userConfirmed = window.confirm(
        `Move task "${draggedTask.title}" from "${sourceColumn.title}" to "${destColumn.title}"?`,
      )
      if (!userConfirmed) return
      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = Array.from(destColumn.tasks)

      sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, draggedTask)

      const newSourceColumn = {
        ...sourceColumn,
        tasks: sourceTasks,
      }

      const newDestColumn = {
        ...destColumn,
        tasks: destTasks,
      }

      setColumns(
        columns.map((col) => {
          if (col.id === newSourceColumn.id) return newSourceColumn
          if (col.id === newDestColumn.id) return newDestColumn
          return col
        }),
      )
    }
  }

  return (
    <div className="kanban-board">
      <div className="board-header">
        <button className="add-column-btn" onClick={addColumn}>
          + Add Column
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              columnsMeta={columns.map((c) => ({ id: c.id, title: c.title }))}
              onRenameColumn={renameColumn}
              onDeleteColumn={deleteColumn}
              onAddTask={addTask}
              onMoveTask={moveTaskToColumn}
              onDeleteTask={deleteTask}
              onRenameTask={renameTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default KanbanBoard
