import { useState } from "react";
import api from "../services/api";
import "./CreateTaskModal.css";

function CreateTaskModal({ onClose, onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const payload = {
                title: title.trim(),
                description: description.trim() || null,
                priority,
                due_date: dueDate || null,
                assigned_to: assignedTo
                    ? Number(assignedTo)
                    : null,
            };

            const response = await api.post("/tasks/", payload);

            onTaskCreated(response.data);

            onClose();

        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to create task."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onMouseDown={onClose}>

            <div
                className="task-modal"
                onMouseDown={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <div>
                        <span className="modal-label">
                            TASK MANAGEMENT
                        </span>

                        <h2>Create New Task</h2>

                        <p>
                            Add a new task to your workspace.
                        </p>
                    </div>

                    <button
                        className="close-modal"
                        onClick={onClose}
                        type="button"
                    >
                        ×
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Task Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            placeholder="Describe the task..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows="4"
                        />

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Priority
                            </label>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value)
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

                        <div className="form-group">

                            <label>
                                Due Date
                            </label>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) =>
                                    setDueDate(e.target.value)
                                }
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            Assign To
                        </label>

                        <input
                            type="number"
                            placeholder="User ID (optional)"
                            value={assignedTo}
                            onChange={(e) =>
                                setAssignedTo(e.target.value)
                            }
                        />

                        <small>
                            Leave empty to keep the task unassigned.
                        </small>

                    </div>

                    {error && (
                        <div className="modal-error">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Task"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateTaskModal;