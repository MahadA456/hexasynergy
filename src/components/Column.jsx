"use client"

import { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import Task from "./Task"
import "./Column.css"

const Column = ({ column, columnsMeta = [], onRenameColumn, onDeleteColumn, onAddTask, onMoveTask, onDeleteTask, onRenameTask }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(column.title)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const handleTitleSubmit = () => {
    if (editTitle.trim()) {
      onRenameColumn(column.id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleTitleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleTitleSubmit()
    } else if (e.key === "Escape") {
      setEditTitle(column.title)
      setIsEditing(false)
    }
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      onAddTask(column.id, newTaskTitle.trim())
      setNewTaskTitle("")
    }
  }

  return (
    <div className="column">
      <div className="column-header">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyPress}
            className="column-title-input"
            autoFocus
          />
        ) : (
          <h3 className="column-title" onClick={() => setIsEditing(true)} title="Click to edit">
            {column.title}
          </h3>
        )}

        <button
          className="delete-column-btn"
          onClick={() => {
            const confirmed = window.confirm(`Delete column "${column.title}" and all its tasks?`)
            if (confirmed) onDeleteColumn(column.id)
          }}
          title="Delete column"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          placeholder="Add a task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="add-task-input"
        />
        <button type="submit" className="add-task-btn">
          +
        </button>
      </form>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            className={`tasks-container ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                currentColumnId={column.id}
                columnsMeta={columnsMeta}
                onMoveTask={onMoveTask}
                onDeleteTask={() => {
                  const confirmed = window.confirm(`Delete task "${task.title}"?`)
                  if (confirmed) onDeleteTask(column.id, task.id)
                }}
                onRenameTask={(newTitle) => onRenameTask && onRenameTask(column.id, task.id, newTitle)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="task-count">
        {column.tasks.length} task{column.tasks.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}

export default Column
