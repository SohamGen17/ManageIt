import { useEffect, useState } from "react";

function TaskForm({ onTaskAdded, editingTask, onTaskUpdated, onCancelEdit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [priority, setPriority] = useState("medium");
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description || "");
            setStatus(editingTask.status);
            setPriority(editingTask.priority);
        } else {
            setTitle("");
            setDescription("");
            setStatus("pending");
            setPriority("medium");
        }

        setError("");
    }, [editingTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        setError("");

        const taskData = {
            title: title.trim(),
            description,
            status,
            priority
        };

        if (editingTask) {
            await onTaskUpdated(editingTask.id, taskData);
        } else {
            await onTaskAdded(taskData);
        }

        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");
    };

    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");
        setError("");
        onCancelEdit();
    };

    return (
        <div className="form-container">
            <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>

            <form onSubmit={handleSubmit}>
                {error && (
                    <p className="error-message">{error}</p>
                )}

                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Enter task description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button className="primary-button" type="submit">
                        {editingTask ? "Update Task" : "Add Task"}
                    </button>

                    {editingTask && (
                        <button
                            className="secondary-button"
                            type="button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default TaskForm;