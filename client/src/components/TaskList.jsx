import TaskCard from "./TaskCard";

function TaskList({ tasks, onDelete, onEdit }) {
    if (tasks.length === 0) {
        return (
            <p className="empty-message">
                No matching tasks found.
            </p>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}

export default TaskList;