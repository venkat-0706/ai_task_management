import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Analytics.css";

function Analytics() {
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/analytics/");

            setAnalytics(response.data);
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
                "Unable to load analytics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="analytics-page">
                <div className="analytics-loading">
                    Loading analytics...
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">

            <header className="analytics-header">

                <div>
                    <span className="analytics-label">
                        SYSTEM ANALYTICS
                    </span>

                    <h1>Analytics</h1>

                    <p>
                        Monitor your task activity and document search behavior.
                    </p>
                </div>

                <button
                    className="dashboard-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </header>

            {error && (
                <div className="analytics-error">
                    <strong>Something went wrong</strong>
                    <span>{error}</span>
                </div>
            )}

            {analytics && !error && (
                <>
                    <section className="analytics-cards">

                        <div className="analytics-card">

                            <div className="analytics-card-icon">
                                📋
                            </div>

                            <div>
                                <span>Total Tasks</span>
                                <strong>
                                    {analytics.total_tasks}
                                </strong>
                            </div>

                        </div>

                        <div className="analytics-card">

                            <div className="analytics-card-icon completed">
                                ✓
                            </div>

                            <div>
                                <span>Completed Tasks</span>
                                <strong>
                                    {analytics.completed_tasks}
                                </strong>
                            </div>

                        </div>

                        <div className="analytics-card">

                            <div className="analytics-card-icon pending">
                                ⏳
                            </div>

                            <div>
                                <span>Pending Tasks</span>
                                <strong>
                                    {analytics.pending_tasks}
                                </strong>
                            </div>

                        </div>

                        <div className="analytics-card">

                            <div className="analytics-card-icon search">
                                🔍
                            </div>

                            <div>
                                <span>Search Queries</span>
                                <strong>
                                    {analytics.most_searched_queries?.length || 0}
                                </strong>
                            </div>

                        </div>

                    </section>

                    <section className="analytics-content">

                        <div className="analytics-panel">

                            <div className="panel-header">

                                <div>
                                    <span className="panel-label">
                                        TASK OVERVIEW
                                    </span>

                                    <h2>Task Statistics</h2>
                                </div>

                            </div>

                            <div className="task-statistics">

                                <div className="stat-row">

                                    <div className="stat-title">
                                        <span className="stat-dot total"></span>
                                        Total Tasks
                                    </div>

                                    <strong>
                                        {analytics.total_tasks}
                                    </strong>

                                </div>

                                <div className="progress-track">
                                    <div
                                        className="progress-fill total-fill"
                                        style={{
                                            width: "100%"
                                        }}
                                    ></div>
                                </div>


                                <div className="stat-row">

                                    <div className="stat-title">
                                        <span className="stat-dot completed"></span>
                                        Completed
                                    </div>

                                    <strong>
                                        {analytics.completed_tasks}
                                    </strong>

                                </div>

                                <div className="progress-track">

                                    <div
                                        className="progress-fill completed-fill"
                                        style={{
                                            width:
                                                analytics.total_tasks > 0
                                                    ? `${(
                                                        analytics.completed_tasks /
                                                        analytics.total_tasks
                                                    ) * 100}%`
                                                    : "0%"
                                        }}
                                    ></div>

                                </div>


                                <div className="stat-row">

                                    <div className="stat-title">
                                        <span className="stat-dot pending"></span>
                                        Pending
                                    </div>

                                    <strong>
                                        {analytics.pending_tasks}
                                    </strong>

                                </div>

                                <div className="progress-track">

                                    <div
                                        className="progress-fill pending-fill"
                                        style={{
                                            width:
                                                analytics.total_tasks > 0
                                                    ? `${(
                                                        analytics.pending_tasks /
                                                        analytics.total_tasks
                                                    ) * 100}%`
                                                    : "0%"
                                        }}
                                    ></div>

                                </div>

                            </div>

                        </div>


                        <div className="analytics-panel">

                            <div className="panel-header">

                                <div>
                                    <span className="panel-label">
                                        AI SEARCH
                                    </span>

                                    <h2>Most Searched Queries</h2>
                                </div>

                                <span className="query-count">
                                    {analytics.most_searched_queries?.length || 0}
                                </span>

                            </div>

                            {analytics.most_searched_queries?.length === 0 ? (

                                <div className="no-searches">
                                    <div>🔍</div>

                                    <h3>No searches yet</h3>

                                    <p>
                                        Your document search activity will appear here.
                                    </p>
                                </div>

                            ) : (

                                <div className="queries-list">

                                    {analytics.most_searched_queries.map(
                                        (item, index) => (

                                            <div
                                                className="query-item"
                                                key={`${item.query}-${index}`}
                                            >

                                                <div className="query-rank">
                                                    #{index + 1}
                                                </div>

                                                <div className="query-info">

                                                    <strong>
                                                        {item.query}
                                                    </strong>

                                                    <span>
                                                        {item.count}{" "}
                                                        {item.count === 1
                                                            ? "search"
                                                            : "searches"}
                                                    </span>

                                                </div>

                                                <div className="query-count-badge">
                                                    {item.count}
                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </section>


                    <section className="analytics-summary">

                        <div>

                            <span>Completion Rate</span>

                            <strong>
                                {analytics.total_tasks > 0
                                    ? `${(
                                        (
                                            analytics.completed_tasks /
                                            analytics.total_tasks
                                        ) * 100
                                    ).toFixed(1)}%`
                                    : "0%"}
                            </strong>

                        </div>

                        <div>

                            <span>Pending Rate</span>

                            <strong>
                                {analytics.total_tasks > 0
                                    ? `${(
                                        (
                                            analytics.pending_tasks /
                                            analytics.total_tasks
                                        ) * 100
                                    ).toFixed(1)}%`
                                    : "0%"}
                            </strong>

                        </div>

                        <div>

                            <span>Search Activity</span>

                            <strong>
                                {analytics.most_searched_queries?.reduce(
                                    (total, item) =>
                                        total + item.count,
                                    0
                                ) || 0}
                            </strong>

                        </div>

                    </section>

                </>
            )}

        </div>
    );
}

export default Analytics;