import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AuditLogs.css";

function AuditLogs() {
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/audit-logs/");

            setLogs(response.data || []);
        } catch (err) {
            console.error(err);

            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError(
                    "Access denied. Only administrators can view audit logs."
                );
                return;
            }

            setError(
                err.response?.data?.detail ||
                "Unable to load audit logs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const formatAction = (action) => {
        if (!action) {
            return "UNKNOWN";
        }

        return action
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    };

    const getActionClass = (action) => {
        if (!action) {
            return "action-default";
        }

        return `action-${action.toLowerCase()}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleString();
    };

    return (
        <div className="audit-page">

            <header className="audit-header">

                <div className="audit-title-area">

                    <span className="audit-label">
                        SYSTEM ADMINISTRATION
                    </span>

                    <h1>Audit Logs</h1>

                    <p>
                        Monitor system activity and track important user actions.
                    </p>

                </div>

                <button
                    className="audit-dashboard-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>

            <section className="audit-summary">

                <div className="audit-summary-card">

                    <div className="summary-icon">
                        ◉
                    </div>

                    <div>
                        <span>Total Activities</span>
                        <strong>{logs.length}</strong>
                    </div>

                </div>

                <div className="audit-summary-card">

                    <div className="summary-icon">
                        ✓
                    </div>

                    <div>
                        <span>System Status</span>
                        <strong>Active</strong>
                    </div>

                </div>

                <div className="audit-summary-card">

                    <div className="summary-icon">
                        🛡
                    </div>

                    <div>
                        <span>Access Level</span>
                        <strong>Admin</strong>
                    </div>

                </div>

            </section>

            <section className="audit-card">

                <div className="audit-card-header">

                    <div>
                        <h2>Activity History</h2>

                        <p>
                            Recent actions recorded by the system.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={fetchAuditLogs}
                        disabled={loading}
                    >
                        ↻ {loading ? "Refreshing..." : "Refresh"}
                    </button>

                </div>

                {loading && (
                    <div className="audit-state">

                        <div className="audit-spinner"></div>

                        <p>
                            Loading audit logs...
                        </p>

                    </div>
                )}

                {!loading && error && (
                    <div className="audit-error">

                        <div className="error-icon">
                            !
                        </div>

                        <div>
                            <h3>Unable to load logs</h3>

                            <p>
                                {error}
                            </p>
                        </div>

                    </div>
                )}

                {!loading && !error && logs.length === 0 && (
                    <div className="audit-empty">

                        <div className="empty-icon">
                            ◉
                        </div>

                        <h3>
                            No activity recorded
                        </h3>

                        <p>
                            System activity will appear here when users perform actions.
                        </p>

                    </div>
                )}

                {!loading && !error && logs.length > 0 && (
                    <div className="audit-table-wrapper">

                        <table className="audit-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Details</th>
                                    <th>Date & Time</th>
                                </tr>
                            </thead>

                            <tbody>

                                {logs.map((log) => (

                                    <tr key={log.id}>

                                        <td>
                                            <span className="log-id">
                                                #{log.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="user-cell">

                                                <div className="user-avatar">
                                                    {log.user_id || "?"}
                                                </div>

                                                <span>
                                                    User #{log.user_id || "N/A"}
                                                </span>

                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                className={`action-badge ${getActionClass(
                                                    log.action
                                                )}`}
                                            >
                                                {formatAction(log.action)}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="details-cell">
                                                {log.details || "No details available"}
                                            </div>
                                        </td>

                                        <td>
                                            <span className="date-cell">
                                                {formatDate(log.created_at)}
                                            </span>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

        </div>
    );
}

export default AuditLogs;