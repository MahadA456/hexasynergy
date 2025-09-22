import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import "./Task.css"

const Task = ({ task, index, currentColumnId, columnsMeta = [], onMoveTask, onDeleteTask, onRenameTask }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const handleRenameSubmit = () => {
    const value = editTitle.trim()
    if (!value) {
      setEditTitle(task.title)
    } else if (value !== task.title && typeof onRenameTask === "function") {
      onRenameTask(value)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRenameSubmit()
    if (e.key === "Escape") {
      setEditTitle(task.title)
      setIsEditing(false)
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task ${snapshot.isDragging ? "dragging" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            <input
              type="text"
              className="task-title-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <div className="task-content" onClick={() => setIsEditing(true)} title="Click to edit">
              {task.title}
            </div>
          )}
          {columnsMeta.length > 0 && typeof onMoveTask === "function" && (
            <div className="task-actions">
              <select
                className="task-status-select"
                value={currentColumnId}
                onChange={(e) => {
                  const nextColumnId = e.target.value
                  if (nextColumnId === currentColumnId) return
                  const confirmed = window.confirm(
                    `Move task "${task.title}" to "${(columnsMeta.find((c) => c.id === nextColumnId) || {}).title}"?`
                  )
                  if (confirmed) onMoveTask(currentColumnId, nextColumnId, task.id)
                }}
              >
                {columnsMeta.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
              {typeof onDeleteTask === "function" && (
                <button type="button" className="task-delete-btn" onClick={onDeleteTask} title="Delete task">
                  ×
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default Task
