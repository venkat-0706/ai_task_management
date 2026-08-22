import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const isAdmin = user?.role === "admin";

    return (
        <div style={styles.page}>

            <nav style={styles.navbar}>

                <div style={styles.logo}>
                    AI Task Manager
                </div>

                <div style={styles.navRight}>

                    <span style={styles.email}>
                        {user?.email}
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

            <main style={styles.content}>

                <h1>Dashboard</h1>

                <p style={styles.subtitle}>
                    Welcome to your AI-powered task and knowledge management system.
                </p>

                <div style={styles.grid}>

                    <div style={styles.card}>
                        <div style={styles.cardIcon}>
                            ✓
                        </div>

                        <h3>Tasks</h3>

                        <p>
                            Manage assigned tasks
                        </p>

                        <button
                            onClick={() => navigate("/tasks")}
                            style={styles.button}
                        >
                            View Tasks
                        </button>
                    </div>


                    <div style={styles.card}>
                        <div style={styles.cardIcon}>
                            📄
                        </div>

                        <h3>Documents</h3>

                        <p>
                            Upload and search documents
                        </p>

                        <button
                            onClick={() => navigate("/documents")}
                            style={styles.button}
                        >
                            Documents
                        </button>
                    </div>


                    <div style={styles.card}>
                        <div style={styles.cardIcon}>
                            📊
                        </div>

                        <h3>Analytics</h3>

                        <p>
                            View system statistics
                        </p>

                        <button
                            onClick={() => navigate("/analytics")}
                            style={styles.button}
                        >
                            View Analytics
                        </button>
                    </div>


                    {isAdmin && (
                        <div style={styles.adminCard}>

                            <div style={styles.adminIcon}>
                                🛡
                            </div>

                            <h3>
                                Audit Logs
                            </h3>

                            <p>
                                Monitor system activity and user actions
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

            </main>

        </div>
    );
}


const styles = {

    page: {
        minHeight: "100vh",
        background: "#f8fafc",
    },


    navbar: {
        height: "70px",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
    },


    logo: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#4f46e5",
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
        padding: "5px 9px",
        borderRadius: "6px",
        background: "#ede9fe",
        color: "#6d28d9",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.5px",
    },


    logout: {
        padding: "9px 16px",
        border: "none",
        borderRadius: "8px",
        background: "#ef4444",
        color: "white",
        cursor: "pointer",
    },


    content: {
        padding: "40px",
    },


    subtitle: {
        color: "#6b7280",
    },


    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "30px",
    },


    card: {
        padding: "25px",
        background: "white",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    },


    cardIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        marginBottom: "15px",
    },


    button: {
        marginTop: "15px",
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        background: "#4f46e5",
        color: "white",
        cursor: "pointer",
    },


    adminCard: {
        padding: "25px",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #ddd6fe",
        boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
    },


    adminIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        background: "#ede9fe",
        color: "#7c3aed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        marginBottom: "15px",
    },


    adminButton: {
        marginTop: "15px",
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        background: "#7c3aed",
        color: "white",
        cursor: "pointer",
    },
};


export default Dashboard;