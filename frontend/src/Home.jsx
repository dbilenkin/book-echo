function Home({ loggedIn, username }) {
  const handleLogout = () => {
      sessionStorage.removeItem('loggedIn');
      sessionStorage.removeItem('username');
      window.location.reload();
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
          <div className="bg-white shadow-md rounded px-8 py-6 w-[400px] text-center">
              {loggedIn && (
                  <h2 className="text-2xl font-semibold mb-6">
                      Welcome, {username}
                  </h2>
              )}
              {/* Will ultimately put a "my books" list on the homepage */}
              <button
                  id="logout-button"
                  className="mt-4 w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                  onClick={handleLogout}
              >
                  Log Out
              </button>
          </div>
      </div>
  );
}

export default Home;
