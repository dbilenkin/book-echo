import Layout from './components/Layout';
import BookSearch from './components/BookSearch';

function Home({ loggedIn, username }) {
    const handleLogout = () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        window.location.reload();
    };

    return (
        <Layout loggedIn={loggedIn} username={username} onLogout={handleLogout}>
            <BookSearch />
        </Layout>
    );
}

export default Home;
