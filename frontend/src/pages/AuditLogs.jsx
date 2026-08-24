import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AuditLogs.css";

function AuditLog() {
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const fetchLogs = async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await api.get("/audit-logs");

            /*
                Supports different backend response formats:

                [
                    {...},
                    {...}
                ]

                OR

                {
                    logs: [...]
                }

                OR

                {
                    activities: [...]
                }
            */

            const data = response.data;

            if (Array.isArray(data)) {
                setLogs(data);
            } else if (Array.isArray(data.logs)) {
                setLogs(data.logs);
            } else if (Array.isArray(data.activities)) {
                setLogs(data.activities);
            } else {
                setLogs([]);
            }

        } catch (err) {
            console.error("Failed to fetch audit logs:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to load audit logs. Please try again."
            );

        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        fetchLogs();
    }, []);


    const getActionDetails = (action) => {
        const normalizedAction = action?.toUpperCase() || "";

        if (normalizedAction === "LOGIN") {
            return {
                label: "Login",
                icon: "🔐",
                className: "action-login",
            };
        }

        if (normalizedAction === "DOCUMENT_UPLOAD") {
            return {
                label: "Document Upload",
                icon: "📄",
                className: "action-document-upload",
            };
        }

        if (normalizedAction === "DOCUMENT_SEARCH") {
            return {
                label: "Document Search",
                icon: "🔎",
                className: "action-document-search",
            };
        }

        if (normalizedAction === "TASK_CREATED") {
            return {
                label: "Task Created",
                icon: "➕",
                className: "action-task-created",
            };
        }

        if (normalizedAction === "TASK_UPDATE") {
            return {
                label: "Task Updated",
                icon: "📝",
                className: "action-task-updated",
            };
        }

        if (normalizedAction === "TASK_UPDATED") {
            return {
                label: "Task Updated",
                icon: "📝",
                className: "action-task-updated",
            };
        }

        if (normalizedAction === "TASK_COMPLETED") {
            return {
                label: "Task Completed",
                icon: "✓",
                className: "action-task-completed",
            };
        }

        if (normalizedAction === "TASK_DELETE") {
            return {
                label: "Task Deleted",
                icon: "🗑️",
                className: "action-task-deleted",
            };
        }

        if (normalizedAction === "TASK_DELETED") {
            return {
                label: "Task Deleted",
                icon: "🗑️",
                className: "action-task-deleted",
            };
        }

        return {
            label: action || "System Activity",
            icon: "⚡",
            className: "action-default",
        };
    };


    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "N/A";
        }

        try {
            return new Date(dateValue).toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
        } catch {
            return dateValue;
        }
    };


    return (
        <div className="audit-page">

            <div className="audit-container">

                {/* HEADER */}

                <section className="audit-header">

                    <div className="audit-header-left">

                        <span className="audit-label">
                            SYSTEM ADMINISTRATION
                        </span>

                        <h1>
                            Audit Logs
                        </h1>

                        <p>
                            Monitor system activity and track important user actions.
                        </p>

                    </div>


                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                </section>


                {/* STATISTICS */}

                <section className="audit-stats">

                    <div className="audit-stat-card">

                        <div className="stat-icon stat-purple">
                            📊
                        </div>

                        <div className="stat-info">

                            <span className="stat-label">
                                Total Activities
                            </span>

                            <strong className="stat-value">
                                {logs.length}
                            </strong>

                        </div>

                    </div>


                    <div className="audit-stat-card">

                        <div className="stat-icon stat-green">
                            ✓
                        </div>

                        <div className="stat-info">

                            <span className="stat-label">
                                System Status
                            </span>

                            <strong className="stat-value success-value">
                                Active
                            </strong>

                        </div>

                    </div>


                    <div className="audit-stat-card">

                        <div className="stat-icon stat-blue">
                            🛡️
                        </div>

                        <div className="stat-info">

                            <span className="stat-label">
                                Access Level
                            </span>

                            <strong className="stat-value">
                                Administrator
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ERROR */}

                {error && (
                    <div className="audit-error">

                        <span>⚠️</span>

                        <span>
                            {error}
                        </span>

                    </div>
                )}


                {/* ACTIVITY HISTORY */}

                <section className="activity-container">

                    <div className="activity-header">

                        <div className="activity-title-section">

                            <span className="activity-label">
                                SYSTEM ACTIVITY
                            </span>

                            <h2>
                                Activity History
                            </h2>

                            <p>
                                Recent actions recorded by the system.
                            </p>

                        </div>


                        <button
                            className="refresh-button"
                            onClick={() => fetchLogs(true)}
                            disabled={refreshing}
                        >
                            {refreshing
                                ? "Refreshing..."
                                : "↻ Refresh"}
                        </button>

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <div className="audit-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading audit logs...
                            </p>

                        </div>

                    ) : logs.length === 0 ? (

                        <div className="audit-empty">

                            <div className="audit-empty-icon">
                                📋
                            </div>

                            <h3>
                                No Activity Found
                            </h3>

                            <p>
                                System activity will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="audit-table-wrapper">

                            <table className="audit-table">

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            User
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                        <th>
                                            Details
                                        </th>

                                        <th>
                                            Date & Time
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {logs.map((log) => {

                                        const actionInfo =
                                            getActionDetails(
                                                log.action
                                            );

                                        const userName =
                                            log.user?.email ||
                                            log.user_email ||
                                            log.email ||
                                            `User #${log.user_id || "N/A"}`;

                                        const firstLetter =
                                            userName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U";

                                        return (

                                            <tr
                                                key={
                                                    log.id ||
                                                    Math.random()
                                                }
                                            >

                                                {/* ID */}

                                                <td>

                                                    <span className="audit-id">
                                                        #{log.id}
                                                    </span>

                                                </td>


                                                {/* USER */}

                                                <td>

                                                    <div className="audit-user">

                                                        <div className="user-avatar">
                                                            {firstLetter}
                                                        </div>

                                                        <div className="user-info">

                                                            <span className="user-name">
                                                                {userName}
                                                            </span>

                                                            <span className="user-id">
                                                                User ID: {log.user_id || "N/A"}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* ACTION */}

                                                <td>

                                                    <span
                                                        className={`action-badge ${actionInfo.className}`}
                                                    >

                                                        <span>
                                                            {actionInfo.icon}
                                                        </span>

                                                        {actionInfo.label}

                                                    </span>

                                                </td>


                                                {/* DETAILS */}

                                                <td>

                                                    <div className="audit-details">
                                                        {log.details ||
                                                            "No additional details available"}
                                                    </div>

                                                </td>


                                                {/* DATE */}

                                                <td>

                                                    <span className="audit-date">

                                                        {formatDate(
                                                            log.created_at ||
                                                            log.timestamp ||
                                                            log.date
                                                        )}

                                                    </span>

                                                </td>

                                            </tr>

                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default AuditLog;