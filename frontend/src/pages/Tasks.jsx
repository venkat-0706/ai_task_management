import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AITaskGenerator from "../components/AITaskGenerator";
import "./Tasks.css";

function Tasks() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assigned_to: ""
    });


    /* ================================
       FETCH TASKS
    ================================= */

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {
                skip: 0,
                limit: 50
            };

            if (status) {
                params.status = status;
            }

            if (priority) {
                params.priority = priority;
            }

            const response = await api.get(
                "/tasks/",
                { params }
            );

            setTasks(response.data || []);

        } catch (err) {

            console.error(err);

            if (err.response?.status === 401) {
                return;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to load tasks."
            );

        } finally {
            setLoading(false);
        }
    };


    /* ================================
       FETCH USERS
    ================================= */

    const fetchUsers = async () => {
        try {
            setUsersLoading(true);

            const response = await api.get(
                "/users/"
            );

            setUsers(response.data || []);

        } catch (err) {

            console.error(
                "Unable to load users:",
                err
            );

            setUsers([]);

        } finally {
            setUsersLoading(false);
        }
    };


    /* ================================
       LOAD DATA
    ================================= */

    useEffect(() => {
        fetchTasks();
    }, [status, priority]);


    useEffect(() => {
        fetchUsers();
    }, []);


    /* ================================
       CREATE TASK
    ================================= */

    const handleCreateTask = async (e) => {
        e.preventDefault();

        if (!newTask.title.trim()) {
            setError("Task title is required.");
            return;
        }

        try {
            setCreating(true);

            setError("");
            setSuccess("");

            const payload = {
                title: newTask.title.trim(),

                description:
                    newTask.description.trim() || null,

                priority: newTask.priority
            };


            if (newTask.due_date) {
                payload.due_date =
                    newTask.due_date;
            }


            if (newTask.assigned_to) {
                payload.assigned_to =
                    Number(newTask.assigned_to);
            }


            await api.post(
                "/tasks/",
                payload
            );


            setSuccess(
                "Task created and assigned successfully."
            );


            setNewTask({
                title: "",
                description: "",
                priority: "medium",
                due_date: "",
                assigned_to: ""
            });


            setShowCreateForm(false);

            await fetchTasks();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Unable to create task."
            );

        } finally {
            setCreating(false);
        }
    };


    /* ================================
       AI GENERATED TASK
    ================================= */

    const handleAIGeneratedTask = (
        generatedTask
    ) => {

        setNewTask((previousTask) => ({
            ...previousTask,

            title:
                generatedTask.title ||
                previousTask.title,

            description:
                generatedTask.description ||
                previousTask.description,

            priority:
                generatedTask.priority?.toLowerCase() ||
                previousTask.priority,

            due_date:
                formatAIDate(
                    generatedTask.due_date
                ) ||
                previousTask.due_date
        }));


        setError("");

        setSuccess(
            "AI task generated. Review the details before creating it."
        );
    };


    /* ================================
       FORMAT AI DATE
    ================================= */

    const formatAIDate = (value) => {

        if (!value) {
            return "";
        }


        if (
            /^\d{4}-\d{2}-\d{2}$/.test(value)
        ) {
            return value;
        }


        const date = new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }


        return date
            .toISOString()
            .split("T")[0];
    };


    /* ================================
       UPDATE TASK STATUS
    ================================= */

    const updateTaskStatus = async (
        taskId,
        newStatus
    ) => {

        try {

            setUpdatingId(taskId);

            setError("");
            setSuccess("");


            await api.put(
                `/tasks/${taskId}`,
                {
                    status: newStatus
                }
            );


            setSuccess(
                "Task status updated successfully."
            );


            await fetchTasks();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Unable to update task."
            );

        } finally {

            setUpdatingId(null);

        }
    };


    /* ================================
       DELETE TASK
    ================================= */

    const deleteTask = async (taskId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this task?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(taskId);

            setError("");
            setSuccess("");


            await api.delete(
                `/tasks/${taskId}`
            );


            setSuccess(
                "Task deleted successfully."
            );


            await fetchTasks();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Unable to delete task."
            );

        } finally {

            setDeletingId(null);

        }
    };


    /* ================================
       CLEAR FILTERS
    ================================= */

    const clearFilters = () => {

        setStatus("");
        setPriority("");

    };


    /* ================================
       HELPERS
    ================================= */

    const getPriorityClass = (value) => {

        if (!value) {
            return "priority-default";
        }

        return `priority-${value.toLowerCase()}`;

    };


    const getStatusClass = (value) => {

        if (!value) {
            return "status-default";
        }

        return `status-${value.toLowerCase()}`;

    };


    const formatStatus = (value) => {

        if (!value) {
            return "UNKNOWN";
        }

        return value
            .replace("_", " ")
            .toUpperCase();

    };


    const getAssignedUser = (userId) => {

        if (!userId) {
            return null;
        }

        return users.find(
            (user) => user.id === userId
        );

    };


    return (

        <div className="tasks-page">


            {/* HEADER */}

            <header className="tasks-header">

                <div className="tasks-title-area">

                    <span className="tasks-label">
                        TASK MANAGEMENT
                    </span>

                    <h1>
                        Tasks
                    </h1>

                    <p>
                        Manage, track and organize your assigned tasks.
                    </p>

                </div>


                <div className="tasks-header-actions">

                    <button
                        className="dashboard-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <button
                        className="create-task-button"
                        onClick={() => {

                            setShowCreateForm(
                                !showCreateForm
                            );

                            setError("");
                            setSuccess("");

                        }}
                    >

                        <span className="create-icon">
                            +
                        </span>

                        <span>
                            {showCreateForm
                                ? "Close"
                                : "Create Task"}
                        </span>

                    </button>

                </div>

            </header>


            {/* SUCCESS */}

            {success && (

                <div className="success-message">

                    <span>
                        ✓
                    </span>

                    {success}

                </div>

            )}


            {/* ERROR */}

            {error && (

                <div className="error-message">

                    <span>
                        !
                    </span>

                    {error}

                </div>

            )}


            {/* CREATE TASK */}

            {showCreateForm && (

                <section className="create-task-card">


                    <div className="create-task-heading">

                        <div className="create-task-icon">
                            +
                        </div>


                        <div>

                            <h2>
                                Create New Task
                            </h2>

                            <p>
                                Create a task manually or generate one using AI.
                            </p>

                        </div>

                    </div>


                    {/* AI TASK GENERATOR */}

                    <AITaskGenerator
                        onGenerated={
                            handleAIGeneratedTask
                        }
                    />


                    <div className="ai-form-divider">

                        <span>
                            Task Details
                        </span>

                    </div>


                    <form
                        onSubmit={handleCreateTask}
                    >

                        <div className="form-grid">


                            {/* TITLE */}

                            <div className="form-group form-full">

                                <label>
                                    Task Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter task title"
                                    value={newTask.title}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            title:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group form-full">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    placeholder="Describe the task..."
                                    rows="4"
                                    value={
                                        newTask.description
                                    }
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            description:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>


                            {/* PRIORITY */}

                            <div className="form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    value={
                                        newTask.priority
                                    }
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            priority:
                                                e.target.value
                                        })
                                    }
                                >

                                    <option value="low">
                                        Low
                                    </option>

                                    <option value="medium">
                                        Medium
                                    </option>

                                    <option value="high">
                                        High
                                    </option>

                                </select>

                            </div>


                            {/* DUE DATE */}

                            <div className="form-group">

                                <label>
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        newTask.due_date
                                    }
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            due_date:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>


                            {/* ASSIGN USER */}

                            <div className="form-group">

                                <label>
                                    Assign To
                                </label>

                                <select
                                    value={
                                        newTask.assigned_to
                                    }
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            assigned_to:
                                                e.target.value
                                        })
                                    }
                                >

                                    <option value="">
                                        Unassigned
                                    </option>


                                    {usersLoading && (

                                        <option disabled>
                                            Loading users...
                                        </option>

                                    )}


                                    {!usersLoading &&
                                        users.map((user) => (

                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >

                                                {user.name} (
                                                {user.email})

                                            </option>

                                        ))}

                                </select>

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {

                                    setShowCreateForm(false);

                                    setError("");
                                    setSuccess("");

                                }}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="submit-task-button"
                                disabled={creating}
                            >

                                {creating
                                    ? "Creating..."
                                    : "Create Task"}

                            </button>

                        </div>

                    </form>

                </section>

            )}


            {/* FILTERS */}

            <section className="filter-card">

                <div className="filter-heading">

                    <div className="filter-icon">
                        ☷
                    </div>


                    <div>

                        <h2>
                            Filter Tasks
                        </h2>

                        <p>
                            Narrow down your tasks by status or priority.
                        </p>

                    </div>

                </div>


                <div className="filters">


                    <div className="filter-group">

                        <label>
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Statuses
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="in_progress">
                                In Progress
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                        </select>

                    </div>


                    <div className="filter-group">

                        <label>
                            Priority
                        </label>

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                All Priorities
                            </option>

                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>

                        </select>

                    </div>


                    <button
                        className="clear-filter-button"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>

            </section>


            {/* TASK LIST */}

            <section className="tasks-section">

                <div className="tasks-section-header">

                    <div>

                        <h2>

                            {status || priority
                                ? "Filtered Tasks"
                                : "All Tasks"}

                        </h2>

                        <p>

                            {tasks.length} task
                            {tasks.length !== 1
                                ? "s"
                                : ""}

                        </p>

                    </div>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="state-message">

                        <div className="spinner"></div>

                        Loading tasks...

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    tasks.length === 0 && (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ✓
                            </div>

                            <h3>
                                No tasks found
                            </h3>

                            <p>
                                Create a new task or change your filters.
                            </p>

                            <button
                                className="empty-create-button"
                                onClick={() =>
                                    setShowCreateForm(true)
                                }
                            >
                                + Create Your First Task
                            </button>

                        </div>

                    )}


                {/* TASK CARDS */}

                {!loading &&
                    tasks.length > 0 && (

                        <div className="tasks-grid">

                            {tasks.map((task) => {

                                const assignedUser =
                                    getAssignedUser(
                                        task.assigned_to
                                    );

                                return (

                                    <article
                                        className="task-card"
                                        key={task.id}
                                    >

                                        <div className="task-card-header">

                                            <div className="task-number">

                                                TASK #{task.id}

                                            </div>


                                            <span
                                                className={`priority-badge ${getPriorityClass(
                                                    task.priority
                                                )}`}
                                            >

                                                {task.priority ||
                                                    "Normal"}

                                            </span>

                                        </div>


                                        <h3 className="task-title">

                                            {task.title}

                                        </h3>


                                        <p className="task-description">

                                            {task.description ||
                                                "No description provided."}

                                        </p>


                                        <div className="task-details">


                                            {/* STATUS */}

                                            <div className="task-detail">

                                                <span>
                                                    Status
                                                </span>

                                                <strong
                                                    className={`status-badge ${getStatusClass(
                                                        task.status
                                                    )}`}
                                                >

                                                    {formatStatus(
                                                        task.status
                                                    )}

                                                </strong>

                                            </div>


                                            {/* ASSIGNED USER */}

                                            <div className="task-detail">

                                                <span>
                                                    Assigned To
                                                </span>

                                                <strong>

                                                    {assignedUser
                                                        ? assignedUser.name
                                                        : task.assigned_to
                                                            ? `User #${task.assigned_to}`
                                                            : "Unassigned"}

                                                </strong>

                                            </div>


                                            {/* DUE DATE */}

                                            {task.due_date && (

                                                <div className="task-detail">

                                                    <span>
                                                        Due Date
                                                    </span>

                                                    <strong>

                                                        {new Date(
                                                            task.due_date
                                                        ).toLocaleDateString()}

                                                    </strong>

                                                </div>

                                            )}

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="task-actions">


                                            {task.status ===
                                                "pending" && (

                                                <button
                                                    className="start-button"
                                                    disabled={
                                                        updatingId ===
                                                        task.id
                                                    }
                                                    onClick={() =>
                                                        updateTaskStatus(
                                                            task.id,
                                                            "in_progress"
                                                        )
                                                    }
                                                >

                                                    {updatingId === task.id
                                                        ? "Updating..."
                                                        : "Start Task"}

                                                </button>

                                            )}


                                            {task.status !==
                                                "completed" && (

                                                <button
                                                    className="complete-button"
                                                    disabled={
                                                        updatingId ===
                                                        task.id
                                                    }
                                                    onClick={() =>
                                                        updateTaskStatus(
                                                            task.id,
                                                            "completed"
                                                        )
                                                    }
                                                >

                                                    {updatingId === task.id
                                                        ? "Updating..."
                                                        : "Mark Completed"}

                                                </button>

                                            )}


                                            {task.status ===
                                                "completed" && (

                                                <div className="completed-status">

                                                    ✓ Completed

                                                </div>

                                            )}


                                            <button
                                                className="delete-button"
                                                disabled={
                                                    deletingId ===
                                                    task.id
                                                }
                                                onClick={() =>
                                                    deleteTask(task.id)
                                                }
                                            >

                                                {deletingId === task.id
                                                    ? "Deleting..."
                                                    : "Delete"}

                                            </button>

                                        </div>

                                    </article>

                                );

                            })}

                        </div>

                    )}

            </section>

        </div>

    );
}

export default Tasks;