import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ClipboardList,
    Check,
    Clock3,
    Hourglass,
    Search,
    ArrowLeft,
} from "lucide-react";

import api from "../services/api";
import "./Analytics.css";


function Analytics() {
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAnalytics();
    }, []);


    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/analytics/");

            setAnalytics(response.data);
        } catch (error) {
            console.error("Analytics Error:", error);

            setError(
                error.response?.data?.detail ||
                "Failed to load analytics data."
            );
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="analytics-loading">
                Loading analytics...
            </div>
        );
    }


    if (!analytics) {
        return (
            <div className="analytics-page">
                <div className="analytics-error">
                    <strong>Unable to load analytics</strong>
                    <span>{error}</span>

                    <button
                        className="retry-button"
                        onClick={fetchAnalytics}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }


    const totalTasks = analytics.total_tasks || 0;
    const completedTasks = analytics.completed_tasks || 0;
    const inProgressTasks = analytics.in_progress_tasks || 0;
    const pendingTasks = analytics.pending_tasks || 0;

    const searches = analytics.most_searched_queries || [];


    const getPercentage = (value) => {
        if (totalTasks === 0) return 0;

        return Math.round((value / totalTasks) * 100);
    };


    const completionRate = getPercentage(completedTasks);
    const inProgressRate = getPercentage(inProgressTasks);
    const pendingRate = getPercentage(pendingTasks);

    const totalSearchActivity = searches.reduce(
        (total, item) => total + item.count,
        0
    );


    return (
        <div className="analytics-page">

            {/* HEADER */}

            <div className="analytics-header">

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
                    <ArrowLeft size={17} />
                    Dashboard
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="analytics-error">
                    <strong>Something went wrong</strong>
                    <span>{error}</span>
                </div>
            )}


            {/* TOP CARDS */}

            <div className="analytics-cards">

                {/* TOTAL TASKS */}

                <div className="analytics-card">

                    <div className="analytics-card-icon">
                        <ClipboardList size={24} />
                    </div>

                    <div>
                        <span>Total Tasks</span>

                        <strong>
                            {totalTasks}
                        </strong>
                    </div>

                </div>


                {/* COMPLETED */}

                <div className="analytics-card">

                    <div className="analytics-card-icon completed">
                        <Check size={24} />
                    </div>

                    <div>
                        <span>Completed Tasks</span>

                        <strong>
                            {completedTasks}
                        </strong>
                    </div>

                </div>


                {/* IN PROGRESS */}

                <div className="analytics-card">

                    <div className="analytics-card-icon progress">
                        <Clock3 size={24} />
                    </div>

                    <div>
                        <span>In Progress Tasks</span>

                        <strong>
                            {inProgressTasks}
                        </strong>
                    </div>

                </div>


                {/* PENDING */}

                <div className="analytics-card">

                    <div className="analytics-card-icon pending">
                        <Hourglass size={24} />
                    </div>

                    <div>
                        <span>Pending Tasks</span>

                        <strong>
                            {pendingTasks}
                        </strong>
                    </div>

                </div>


                {/* SEARCH QUERIES */}

                <div className="analytics-card search-card">

                    <div className="analytics-card-icon search">
                        <Search size={24} />
                    </div>

                    <div>
                        <span>Search Queries</span>

                        <strong>
                            {searches.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* MAIN CONTENT */}

            <div className="analytics-content">


                {/* TASK STATISTICS */}

                <div className="analytics-panel">

                    <div className="panel-header">

                        <div>
                            <span className="panel-label">
                                TASK OVERVIEW
                            </span>

                            <h2>
                                Task Statistics
                            </h2>
                        </div>

                    </div>


                    <div className="task-statistics">


                        {/* TOTAL */}

                        <div className="stat-block">

                            <div className="stat-row">

                                <div className="stat-title">

                                    <span className="stat-dot"></span>

                                    Total Tasks

                                </div>

                                <strong>
                                    {totalTasks}
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill total-fill"
                                    style={{
                                        width: totalTasks > 0
                                            ? "100%"
                                            : "0%"
                                    }}
                                />

                            </div>

                        </div>


                        {/* COMPLETED */}

                        <div className="stat-block">

                            <div className="stat-row">

                                <div className="stat-title">

                                    <span className="stat-dot completed"></span>

                                    Completed

                                </div>

                                <strong>
                                    {completedTasks}
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill completed-fill"
                                    style={{
                                        width: `${completionRate}%`
                                    }}
                                />

                            </div>

                        </div>


                        {/* IN PROGRESS */}

                        <div className="stat-block">

                            <div className="stat-row">

                                <div className="stat-title">

                                    <span className="stat-dot progress"></span>

                                    In Progress

                                </div>

                                <strong>
                                    {inProgressTasks}
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill progress-fill-color"
                                    style={{
                                        width: `${inProgressRate}%`
                                    }}
                                />

                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="stat-block">

                            <div className="stat-row">

                                <div className="stat-title">

                                    <span className="stat-dot pending"></span>

                                    Pending

                                </div>

                                <strong>
                                    {pendingTasks}
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill pending-fill"
                                    style={{
                                        width: `${pendingRate}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* MOST SEARCHED QUERIES */}

                <div className="analytics-panel search-panel">

                    <div className="panel-header">

                        <div>

                            <span className="panel-label">
                                AI SEARCH
                            </span>

                            <h2>
                                Most Searched Queries
                            </h2>

                        </div>


                        <div className="query-count">

                            {searches.length}

                        </div>

                    </div>


                    {searches.length > 0 ? (

                        <div className="queries-list">

                            {searches.map((item, index) => (

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
                                                : "searches"
                                            }

                                        </span>

                                    </div>


                                    <div className="query-count-badge">

                                        {item.count}

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="no-searches">

                            <div>
                                <Search size={25} />
                            </div>

                            <h3>
                                No searches yet
                            </h3>

                            <p>
                                Your document search activity will appear here.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* SUMMARY */}

            <div className="analytics-summary">

                <div>

                    <span>
                        Completion Rate
                    </span>

                    <strong>
                        {completionRate}%
                    </strong>

                </div>


                <div>

                    <span>
                        In Progress Rate
                    </span>

                    <strong>
                        {inProgressRate}%
                    </strong>

                </div>


                <div>

                    <span>
                        Pending Rate
                    </span>

                    <strong>
                        {pendingRate}%
                    </strong>

                </div>


                <div>

                    <span>
                        Search Activity
                    </span>

                    <strong>
                        {totalSearchActivity}
                    </strong>

                </div>

            </div>

        </div>
    );
}


export default Analytics;