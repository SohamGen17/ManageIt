const pool = require("../config/db");

// GET all tasks
const getTasks = async (req, res) => {
    try {
        const [tasks] = await pool.query(
            "SELECT * FROM tasks ORDER BY created_at DESC"
        );

        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks"
        });
    }
};


// GET single task
const getTask = async (req, res) => {
    try {
        const { id } = req.params;

        const [tasks] = await pool.query(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
        );

        if (tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            data: tasks[0]
        });
    } catch (error) {
        console.error("Error fetching task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch task"
        });
    }
};


// CREATE task
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority
        } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const taskStatus = status || "pending";
        const taskPriority = priority || "medium";

        const [result] = await pool.query(
            `INSERT INTO tasks
            (title, description, status, priority)
            VALUES (?, ?, ?, ?)`,
            [
                title.trim(),
                description || "",
                taskStatus,
                taskPriority
            ]
        );

        const [newTask] = await pool.query(
            "SELECT * FROM tasks WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: newTask[0]
        });
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create task"
        });
    }
};


// UPDATE task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            status,
            priority
        } = req.body;

        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const [result] = await pool.query(
            `UPDATE tasks
             SET title = ?,
                 description = ?,
                 status = ?,
                 priority = ?
             WHERE id = ?`,
            [
                title.trim(),
                description || "",
                status,
                priority,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const [updatedTask] = await pool.query(
            "SELECT * FROM tasks WHERE id = ?",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask[0]
        });
    } catch (error) {
        console.error("Error updating task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update task"
        });
    }
};


// DELETE task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM tasks WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete task"
        });
    }
};


module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};