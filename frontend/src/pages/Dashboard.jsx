import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    // Safely get logged-in user from localStorage
    let user = {};

    try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Error reading user data:", error);
        user = {};
    }

    // Check admin role safely
    const isAdmin =
        user?.role?.toString().toLowerCase() === "admin" ||
        user?.is_admin === true ||
        user?.isAdmin === true;

    console.log("Logged in user:", user);
    console.log("User role:", user?.role);
    console.log("Is Admin:", isAdmin);

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div style={styles.page}>

            {/* NAVBAR */}

            <nav style={styles.navbar}>

                <div
                    style={styles.logo}
                    onClick={() => navigate("/dashboard")}
                >
                    AI Task Manager
                </div>

                <div style={styles.navRight}>

                    <span style={styles.email}>
                        {user?.email || "User"}
                    </span>

                    {isAdmin && (
                        <span style={styles.adminBadge}>
                            ADMIN
                        </span>
                    )}

                    <button
                        onClick={logout}
                        style={styles.logout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* MAIN CONTENT */}

            <main style={styles.content}>

                <h1 style={styles.heading}>
                    Dashboard
                </h1>

                <p style={styles.subtitle}>
                    Welcome to your AI-powered task and knowledge management system.
                </p>


                {/* CARDS */}

                <div style={styles.grid}>

                    {/* TASKS */}

                    <div style={styles.card}>

                        <div style={styles.cardIcon}>
                            ✓
                        </div>

                        <h3 style={styles.cardTitle}>
                            Tasks
                        </h3>

                        <p style={styles.cardText}>
                            Create, manage, assign, and track your tasks.
                        </p>

                        <button
                            onClick={() => navigate("/tasks")}
                            style={styles.button}
                        >
                            View Tasks
                        </button>

                    </div>


                    {/* DOCUMENTS */}

                    <div style={styles.card}>

                        <div style={styles.cardIcon}>
                            📄
                        </div>

                        <h3 style={styles.cardTitle}>
                            Documents
                        </h3>

                        <p style={styles.cardText}>
                            Upload documents and search them using AI.
                        </p>

                        <button
                            onClick={() => navigate("/documents")}
                            style={styles.button}
                        >
                            View Documents
                        </button>

                    </div>


                    {/* ANALYTICS */}

                    <div style={styles.card}>

                        <div style={styles.cardIcon}>
                            📊
                        </div>

                        <h3 style={styles.cardTitle}>
                            Analytics
                        </h3>

                        <p style={styles.cardText}>
                            View task statistics and system insights.
                        </p>

                        <button
                            onClick={() => navigate("/analytics")}
                            style={styles.button}
                        >
                            View Analytics
                        </button>

                    </div>


                    {/* AUDIT LOGS - ADMIN ONLY */}

                    {isAdmin && (
                        <div style={styles.adminCard}>

                            <div style={styles.adminIcon}>
                                🛡️
                            </div>

                            <h3 style={styles.cardTitle}>
                                Audit Logs
                            </h3>

                            <p style={styles.cardText}>
                                Monitor system activity and track important user actions.
                            </p>

                            <button
                                onClick={() => navigate("/audit-logs")}
                                style={styles.adminButton}
                            >
                                View Audit Logs
                            </button>

                        </div>
                    )}

                </div>


                {/* ADMIN INFORMATION */}

                {isAdmin && (
                    <div style={styles.adminPanel}>

                        <div>

                            <div style={styles.adminPanelLabel}>
                                ADMINISTRATION
                            </div>

                            <h2 style={styles.adminPanelTitle}>
                                System Administration
                            </h2>

                            <p style={styles.adminPanelText}>
                                You have administrator privileges. You can monitor
                                system activity and review audit logs.
                            </p>

                        </div>

                        <button
                            onClick={() => navigate("/audit-logs")}
                            style={styles.adminPanelButton}
                        >
                            Open Audit Logs →
                        </button>

                    </div>
                )}

            </main>

        </div>
    );
}


const styles = {

    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
    },


    navbar: {
        height: "70px",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxSizing: "border-box",
    },


    logo: {
        fontSize: "21px",
        fontWeight: "700",
        color: "#4f46e5",
        cursor: "pointer",
    },


    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },


    email: {
        color: "#6b7280",
        fontSize: "14px",
    },


    adminBadge: {
        padding: "5px 10px",
        borderRadius: "6px",
        background: "#ede9fe",
        color: "#6d28d9",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.6px",
    },


    logout: {
        padding: "9px 16px",
        border: "none",
        borderRadius: "8px",
        background: "#ef4444",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600",
    },


    content: {
        maxWidth: "1250px",
        margin: "0 auto",
        padding: "45px 40px",
    },


    heading: {
        margin: "0",
        fontSize: "36px",
        color: "#111827",
    },


    subtitle: {
        marginTop: "10px",
        color: "#6b7280",
        fontSize: "15px",
    },


    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "22px",
        marginTop: "35px",
    },


    card: {
        padding: "25px",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    },


    adminCard: {
        padding: "25px",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #ddd6fe",
        boxShadow: "0 5px 20px rgba(124,58,237,0.10)",
    },


    cardIcon: {
        width: "45px",
        height: "45px",
        borderRadius: "11px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        marginBottom: "18px",
    },


    adminIcon: {
        width: "45px",
        height: "45px",
        borderRadius: "11px",
        background: "#ede9fe",
        color: "#7c3aed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        marginBottom: "18px",
    },


    cardTitle: {
        margin: "0 0 10px",
        fontSize: "19px",
        color: "#111827",
    },


    cardText: {
        margin: "0",
        color: "#6b7280",
        fontSize: "14px",
        lineHeight: "1.6",
        minHeight: "45px",
    },


    button: {
        marginTop: "20px",
        padding: "10px 17px",
        border: "none",
        borderRadius: "8px",
        background: "#4f46e5",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600",
    },


    adminButton: {
        marginTop: "20px",
        padding: "10px 17px",
        border: "none",
        borderRadius: "8px",
        background: "#7c3aed",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600",
    },


    adminPanel: {
        marginTop: "35px",
        padding: "28px",
        borderRadius: "16px",
        background: "#ffffff",
        border: "1px solid #ddd6fe",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "25px",
        boxShadow: "0 5px 20px rgba(124,58,237,0.08)",
    },


    adminPanelLabel: {
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "1px",
        color: "#7c3aed",
    },


    adminPanelTitle: {
        margin: "8px 0",
        color: "#111827",
        fontSize: "22px",
    },


    adminPanelText: {
        margin: "0",
        color: "#6b7280",
        fontSize: "14px",
        lineHeight: "1.6",
    },


    adminPanelButton: {
        padding: "12px 18px",
        border: "none",
        borderRadius: "9px",
        background: "#7c3aed",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },

};


export default Dashboard;