import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import AuditLogs from "./pages/AuditLogs";


function ProtectedRoute({ children }) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/documents"
                    element={
                        <ProtectedRoute>
                            <Documents />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/audit-logs"
                    element={
                        <ProtectedRoute>
                            <AuditLogs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;