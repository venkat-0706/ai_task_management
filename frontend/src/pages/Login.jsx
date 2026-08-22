import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            const token = response.data.access_token;

            localStorage.setItem(
                "access_token",
                token
            );

            const user = response.data.user;

            if (user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            } else {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        email: formData.email,
                    })
                );
            }

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                setError("Invalid email or password");
            } else {
                setError(
                    error.response?.data?.detail ||
                    "Unable to connect to the server"
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <div className="logo">
                        AI
                    </div>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to your AI Task Management System
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;