function TaskCard({ task, onDelete, onEdit }) {
    return (
        <div className="task-card">
            <h3>{task.title}</h3>

            <p className="task-description">
                {task.description || "No description provided."}
            </p>

            <div className="task-details">
                <span className="badge">
                    Status: {task.status.replace("_", " ")}
                </span>

                <span className="badge">
                    Priority: {task.priority}
                </span>
            </div>

            <div className="task-actions">
                <button
                    className="edit-button"
                    onClick={() => onEdit(task)}
                >
                    Edit
                </button>

                <button
                    className="delete-button"
                    onClick={() => onDelete(task.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskCard;