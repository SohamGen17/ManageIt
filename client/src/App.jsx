import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import Filters from "./components/Filters";
import TaskList from "./components/TaskList";

import {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} from "./services/taskService";

function App() {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const loadTasks = async () => {
        try {
            const response = await getTasks();
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            setError("Failed to load tasks");
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleTaskAdded = async (task) => {
        try {
            const response = await createTask(task);

            setTasks((previousTasks) => [
                response.data,
                ...previousTasks
            ]);
        } catch (error) {
            console.error(error);
            setError("Failed to create task");
        }
    };

    const handleTaskUpdated = async (id, task) => {
        try {
            const response = await updateTask(id, task);

            setTasks((previousTasks) =>
                previousTasks.map((existingTask) =>
                    existingTask.id === id
                        ? response.data
                        : existingTask
                )
            );

            setEditingTask(null);
        } catch (error) {
            console.error(error);
            setError("Failed to update task");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);

            setTasks((previousTasks) =>
                previousTasks.filter((task) => task.id !== id)
            );
        } catch (error) {
            console.error(error);
            setError("Failed to delete task");
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    const filteredTasks = tasks.filter((task) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            task.title.toLowerCase().includes(searchText) ||
            (task.description || "")
                .toLowerCase()
                .includes(searchText);

        const matchesStatus =
            statusFilter === "all" ||
            task.status === statusFilter;

        const matchesPriority =
            priorityFilter === "all" ||
            task.priority === priorityFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );
    });

    return (
        <div>
            <h1>ManageIt</h1>
            <p>Task Management System</p>

            {error && <p>{error}</p>}

            <TaskForm
                onTaskAdded={handleTaskAdded}
                editingTask={editingTask}
                onTaskUpdated={handleTaskUpdated}
                onCancelEdit={handleCancelEdit}
            />

            <h2>Tasks</h2>

            <Filters
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
            />

            <TaskList
    tasks={filteredTasks}
    onDelete={handleDelete}
    onEdit={handleEdit}
/>
        </div>
    );
}

export default App;