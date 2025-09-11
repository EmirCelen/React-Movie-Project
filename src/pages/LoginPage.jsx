import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Register'da şifre kontrolü
        if (isRegister && password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const endpoint = isRegister ? "/register" : "/login";
            const body = isRegister
                ? { email, username, password }
                : { username, password };

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}${endpoint}`,
                body
            );

            if (isRegister) {
                alert("Account created! You can now log in.");
                setIsRegister(false);
            } else {
                login(data.token); // token sakla
                navigate("/"); // anasayfaya dön
            }
        } catch (err) {
            console.error("Register/Login error:", err.response?.data || err.message);

            // Backend’ten gelen hata mesajını göster
            const message = err.response?.data?.error || "Something went wrong!";
            alert(message);
        }

    };

    return (
        <div className="relative flex items-center justify-center min-h-screen text-white">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 "
                style={{ backgroundImage: "url('/login-bg.jpg')" }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25 z-10" />

            {/* Form */}
            <div className="relative z-20 bg-black bg-opacity-80 p-10 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    {isRegister ? "Sign Up" : "Login"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    )}

                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {isRegister && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-semibold"
                    >
                        {isRegister ? "Sign Up" : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-400">
                    {isRegister ? (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => setIsRegister(false)}
                                className="text-red-500 hover:underline"
                            >
                                Login
                            </button>
                        </>
                    ) : (
                        <>
                            Don’t have an account?{" "}
                            <button
                                onClick={() => setIsRegister(true)}
                                className="text-red-500 hover:underline"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
