import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            setMessage(data.message);
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', data.user.username);
            if (onLogin) onLogin();
            navigate('/');
        } else {
            setMessage(data.detail || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
            <div className="bg-white shadow-md rounded px-8 py-6 w-[400px]">
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                    >
                        Login
                    </button>
                </form>
                {message && (
                    <div className="mt-4 text-center text-sm text-indigo-700">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
