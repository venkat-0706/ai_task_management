import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AI.css";

function AI() {
    const navigate = useNavigate();

    const [prompt, setPrompt] = useState("");
    const [task, setTask] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateTask = async () => {
        if (!prompt.trim()) {
            setError("Please describe the task you want to create.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setTask(null);

            const response = await api.post(
                "/ai/generate-task",
                {
                    prompt: prompt.trim()
                }
            );

            setTask(response.data);

        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to generate task."
            );
        } finally {
            setLoading(false);
        }
    };

    const clearTask = () => {
        setPrompt("");
        setTask(null);
        setError("");
    };

    const getPriorityClass = (priority) => {
        if (!priority) {
            return "priority-default";
        }

        return `priority-${priority.toLowerCase()}`;
    };

    return (
        <div className="ai-page">

            <header className="ai-header">

                <div>
                    <span className="ai-label">
                        AI TASK ASSISTANT
                    </span>

                    <h1>AI Task Generator</h1>

                    <p>
                        Describe a task in natural language and let AI
                        structure it for you.
                    </p>
                </div>

                <button
                    className="dashboard-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>

            <main className="ai-content">

                <section className="ai-generator-card">

                    <div className="ai-card-header">

                        <div className="ai-icon">
                            ✨
                        </div>

                        <div>
                            <h2>
                                Describe Your Task
                            </h2>

                            <p>
                                Tell the AI what you need to accomplish.
                            </p>
                        </div>

                    </div>

                    <textarea
                        className="ai-prompt"
                        placeholder="Example: Create a high priority task to review the project documentation by Friday..."
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value);
                            setError("");
                        }}
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                e.ctrlKey
                            ) {
                                generateTask();
                            }
                        }}
                    />

                    <div className="prompt-footer">

                        <span>
                            {prompt.length} characters
                        </span>

                        <span>
                            Ctrl + Enter to generate
                        </span>

                    </div>

                    {error && (
                        <div className="ai-error">
                            {error}
                        </div>
                    )}

                    <div className="ai-actions">

                        <button
                            className="clear-button"
                            onClick={clearTask}
                            disabled={
                                loading ||
                                (!prompt && !task)
                            }
                        >
                            Clear
                        </button>

                        <button
                            className="generate-button"
                            onClick={generateTask}
                            disabled={
                                loading ||
                                !prompt.trim()
                            }
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    ✨ Generate Task
                                </>
                            )}
                        </button>

                    </div>

                </section>

                {task && (
                    <section className="generated-task-card">

                        <div className="generated-header">

                            <div>
                                <span className="result-label">
                                    AI GENERATED
                                </span>

                                <h2>
                                    Generated Task
                                </h2>
                            </div>

                            <span
                                className={`priority-badge ${getPriorityClass(
                                    task.priority
                                )}`}
                            >
                                {task.priority || "Normal"}
                            </span>

                        </div>

                        <div className="task-details">

                            <div className="detail-item">

                                <span className="detail-label">
                                    TITLE
                                </span>

                                <h3>
                                    {task.title}
                                </h3>

                            </div>

                            <div className="detail-item">

                                <span className="detail-label">
                                    DESCRIPTION
                                </span>

                                <p>
                                    {task.description ||
                                        "No description provided."}
                                </p>

                            </div>

                            <div className="detail-grid">

                                <div className="detail-item">

                                    <span className="detail-label">
                                        PRIORITY
                                    </span>

                                    <span
                                        className={`priority-value ${getPriorityClass(
                                            task.priority
                                        )}`}
                                    >
                                        {task.priority ||
                                            "Normal"}
                                    </span>

                                </div>

                                <div className="detail-item">

                                    <span className="detail-label">
                                        DUE DATE
                                    </span>

                                    <span className="due-date">
                                        {task.due_date
                                            ? new Date(
                                                task.due_date
                                            ).toLocaleDateString()
                                            : "Not specified"}
                                    </span>

                                </div>

                            </div>

                        </div>

                        <div className="generated-footer">

                            <span>
                                ✓ Task generated successfully
                            </span>

                            <button
                                onClick={() =>
                                    navigate("/tasks")
                                }
                            >
                                Go to Tasks →
                            </button>

                        </div>

                    </section>
                )}

                {!task && !loading && (
                    <section className="ai-info-card">

                        <div className="info-icon">
                            🤖
                        </div>

                        <div>
                            <h3>
                                How it works
                            </h3>

                            <p>
                                Describe your task naturally. The AI
                                analyzes your request and generates a
                                structured task with a title,
                                description, priority, and due date.
                            </p>
                        </div>

                    </section>
                )}

            </main>

        </div>
    );
}

export default AI;