import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './components/Layout';

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
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', data.user.username);
            if (onLogin) onLogin();
            navigate('/');
        } else {
            setMessage(data.detail || 'Login failed');
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                        Login
                    </button>
                </form>
                {message && <p className="text-center text-sm mt-4 text-indigo-600">{message}</p>}
            </div>
        </Layout>
    );
}

export default Login;
