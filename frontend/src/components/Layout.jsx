// src/components/Layout.jsx
import { Link } from 'react-router-dom';

function Layout({ children, loggedIn, username, onLogout }) {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <header className="bg-white shadow">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">📚 Book Echo</h1>
                    <div className="space-x-4 text-sm">
                        <Link to="/" className="text-indigo-600 hover:underline">Home</Link>
                        {!loggedIn && (
                            <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                        )}
                        {loggedIn && (
                            <>
                                <span className="text-gray-700">{username}</span>
                                <button
                                    className="text-red-600 hover:underline"
                                    onClick={onLogout}
                                >
                                    Log Out
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            </header>
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    );
}

export default Layout;
