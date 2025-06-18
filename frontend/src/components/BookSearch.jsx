import { useState } from 'react';

function BookSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [addedKeys, setAddedKeys] = useState(new Set());

    const username = sessionStorage.getItem('username');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setResults([]);
        setAddedKeys(new Set());

        try {
            const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (res.ok) {
                setResults(data.results);
            } else {
                setError(data.error || 'Search failed.');
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (book) => {
        try {
            const response = await fetch('http://localhost:8000/user/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    title: book.title,
                    author: book.author,
                    year: book.year,
                    openlibrary_key: book.key,
                    cover_url: book.cover_url
                }),
            });

            if (response.ok) {
                setAddedKeys(prev => new Set(prev).add(book.key));
            } else {
                console.error("Failed to add book:", await response.text());
            }
        } catch (err) {
            console.error("Error adding book:", err);
        }
    };

    return (
        <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search books by title"
                    className="flex-grow px-4 py-2 border rounded"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                    Search
                </button>
            </form>

            {loading && <p className="text-gray-600 text-center">Loading...</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <ul className="space-y-3">
                {results.map((book) => (
                    <li key={book.key} className="bg-white shadow p-4 rounded flex gap-4 items-start">
                        {book.cover_url && (
                            <img
                                src={book.cover_url}
                                alt={book.title}
                                className="w-20 h-auto rounded shadow-sm"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{book.title}</h3>
                            <p className="text-sm text-gray-700">
                                {book.author || 'Unknown author'} ({book.year || 'N/A'})
                            </p>
                        </div>
                        {username && (
                            <button
                                className={`text-sm px-3 py-1 rounded ${
                                    addedKeys.has(book.key)
                                        ? "bg-green-500 text-white cursor-default"
                                        : "bg-indigo-500 text-white hover:bg-indigo-600"
                                }`}
                                disabled={addedKeys.has(book.key)}
                                onClick={() => handleAddBook(book)}
                            >
                                {addedKeys.has(book.key) ? "Added" : "Add to My List"}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookSearch;
