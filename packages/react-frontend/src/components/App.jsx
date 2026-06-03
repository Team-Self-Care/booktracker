import { useEffect, useState } from 'react';
import Landing from './Landing';
import Navbar from './Navbar';
import Reviews from './Reviews';
import Search from './Search';
import Table from './List';
import UserPage from './UserPage';
import '../style/css/index.css';

function App() {
	const [activePage, setActivePage] = useState('Home');
	const [currentUser, setCurrentUser] = useState(() => {
		const savedUser = localStorage.getItem('booktracker-user');
		return savedUser ? JSON.parse(savedUser) : null;
	});

	useEffect(() => {
		if (currentUser) {
			localStorage.setItem('booktracker-user', JSON.stringify(currentUser));
			return;
		}

		localStorage.removeItem('booktracker-user');
	}, [currentUser]);

	const handleAuth = (user) => {
		setCurrentUser(user);
		setActivePage('Home');
	};

	const pages = {
		Home: <Landing onNavigate={setActivePage} />,
		Search: <Search currentUser={currentUser} onNavigate={setActivePage} />,
		Reviews: <Reviews currentUser={currentUser} onNavigate={setActivePage} />,
		List: <Table currentUser={currentUser} onNavigate={setActivePage} />,
		Account: (
			<UserPage
				currentUser={currentUser}
				onLogout={() => setCurrentUser(null)}
				onSubmit={handleAuth}
			/>
		),
	};

	return (
		<div className="app-shell">
			<Navbar
				activePage={activePage}
				currentUser={currentUser}
				onNavigate={setActivePage}
			/>
			{pages[activePage] ?? pages.Home}
		</div>
	);
}

export default App;
