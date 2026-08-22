import { useState } from "react";
import api from "../services/api";
import "./AITaskGenerator.css";

function AITaskGenerator({ onGenerated }) {
    const [prompt, setPrompt] = useState("");
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");
    const [generated, setGenerated] = useState(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please describe the task you want AI to generate.");
            return;
        }

        try {
            setGenerating(true);
            setError("");
            setGenerated(null);

            const response = await api.post(
                "/ai/generate-task",
                {
                    prompt: prompt.trim()
                }
            );

            const task = response.data;

            setGenerated(task);

            if (onGenerated) {
                onGenerated(task);
            }

        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                return;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to generate task using AI."
            );
        } finally {
            setGenerating(false);
        }
    };

    const clearGenerator = () => {
        setPrompt("");
        setGenerated(null);
        setError("");
    };

    return (
        <div className="ai-task-generator">

            <div className="ai-generator-header">

                <div className="ai-generator-icon">
                    ✨
                </div>

                <div>
                    <h3>
                        AI Task Generator
                    </h3>

                    <p>
                        Describe what you need to accomplish and let AI
                        create the task details for you.
                    </p>
                </div>

            </div>

            <div className="ai-generator-body">

                <label className="ai-generator-label">
                    Task Prompt
                </label>

                <textarea
                    className="ai-prompt-input"
                    placeholder="Example: Create a high priority task to complete the API documentation by next Friday."
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        setError("");
                    }}
                    rows="4"
                    disabled={generating}
                />

                <div className="ai-generator-footer">

                    <span className="ai-hint">
                        Be specific about the task, priority or deadline.
                    </span>

                    <div className="ai-generator-actions">

                        {prompt && (
                            <button
                                type="button"
                                className="ai-clear-button"
                                onClick={clearGenerator}
                                disabled={generating}
                            >
                                Clear
                            </button>
                        )}

                        <button
                            type="button"
                            className="ai-generate-button"
                            onClick={handleGenerate}
                            disabled={
                                generating ||
                                !prompt.trim()
                            }
                        >
                            {generating ? (
                                <>
                                    <span className="ai-spinner"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    ✨ Generate Task
                                </>
                            )}
                        </button>

                    </div>

                </div>

                {error && (
                    <div className="ai-error-message">
                        <span>!</span>
                        <span>{error}</span>
                    </div>
                )}

                {generated && (
                    <div className="ai-generated-preview">

                        <div className="ai-preview-header">

                            <div>
                                <span className="ai-preview-label">
                                    AI GENERATED
                                </span>

                                <h4>
                                    Task Preview
                                </h4>
                            </div>

                            <span className="ai-success-icon">
                                ✓
                            </span>

                        </div>

                        <div className="ai-preview-content">

                            <div className="ai-preview-field">

                                <span>
                                    Title
                                </span>

                                <strong>
                                    {generated.title ||
                                        "No title generated"}
                                </strong>

                            </div>

                            <div className="ai-preview-field">

                                <span>
                                    Description
                                </span>

                                <p>
                                    {generated.description ||
                                        "No description generated"}
                                </p>

                            </div>

                            <div className="ai-preview-grid">

                                <div className="ai-preview-field">

                                    <span>
                                        Priority
                                    </span>

                                    <strong
                                        className={`ai-priority ai-priority-${(
                                            generated.priority ||
                                            "medium"
                                        ).toLowerCase()}`}
                                    >
                                        {generated.priority ||
                                            "Medium"}
                                    </strong>

                                </div>

                                <div className="ai-preview-field">

                                    <span>
                                        Due Date
                                    </span>

                                    <strong>
                                        {generated.due_date ||
                                            "Not specified"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        <div className="ai-preview-note">
                            ✓ These details have been added to the task
                            form below. Review them before creating the task.
                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}

export default AITaskGenerator;