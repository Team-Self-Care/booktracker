import { useEffect, useState } from 'react';
import Landing from './Landing';
import Navbar from './Navbar';
import Reviews from './Reviews';
import Search from './Search';
import Table from './Library';
import UserPage from './UserPage';
import '../style/css/index.css';

function App() {
	const [activePage, setActivePage] = useState('Home');
	const [currentUser, setCurrentUser] = useState(() => {
		const savedUser = localStorage.getItem('booktracker-user');
		return savedUser ? JSON.parse(savedUser) : null;
	});
	const [libraryBooks, setLibraryBooks] = useState(() => {
		const savedBooks = localStorage.getItem('booktracker-library');
		return savedBooks ? JSON.parse(savedBooks) : [];
	});
	const [readerReviews, setReaderReviews] = useState(() => {
		const savedReviews = localStorage.getItem('booktracker-reviews');
		return savedReviews ? JSON.parse(savedReviews) : [];
	});

	useEffect(() => {
		if (currentUser) {
			localStorage.setItem('booktracker-user', JSON.stringify(currentUser));
			return;
		}

		localStorage.removeItem('booktracker-user');
	}, [currentUser]);

	useEffect(() => {
		localStorage.setItem('booktracker-library', JSON.stringify(libraryBooks));
	}, [libraryBooks]);

	useEffect(() => {
		localStorage.setItem('booktracker-reviews', JSON.stringify(readerReviews));
	}, [readerReviews]);

	const handleAuth = (user) => {
		setCurrentUser(user);
		setActivePage('Home');
	};

	const handleAddToLibrary = (book, status = 'Want to read') => {
		const bookId = book.id ?? `${book.title}-${book.author}`;
		const savedAt = new Date().toISOString();

		setLibraryBooks((books) => {
			const existingBook = books.find((item) => item.id === bookId);

			if (existingBook) {
				return books.map((item) =>
					item.id === bookId
						? {
								...item,
								...book,
								status: item.status ?? status,
								updatedAt: savedAt,
							}
						: item
				);
			}

			return [
				{
					...book,
					id: bookId,
					isFavorite: false,
					notes: '',
					progress: 0,
					savedAt,
					status,
					updatedAt: savedAt,
				},
				...books,
			];
		});
	};

	const handleUpdateLibraryBook = (bookId, updates) => {
		setLibraryBooks((books) =>
			books.map((book) =>
				book.id === bookId
					? { ...book, ...updates, updatedAt: new Date().toISOString() }
					: book
			)
		);
	};

	const handleRemoveLibraryBook = (bookId) => {
		setLibraryBooks((books) => books.filter((book) => book.id !== bookId));
	};

	const pages = {
		Home: <Landing onNavigate={setActivePage} />,
		Search: (
			<Search
				currentUser={currentUser}
				libraryBooks={libraryBooks}
				onAddToLibrary={handleAddToLibrary}
				onNavigate={setActivePage}
			/>
		),
		Reviews: (
			<Reviews
				currentUser={currentUser}
				onNavigate={setActivePage}
				readerReviews={readerReviews}
				setReaderReviews={setReaderReviews}
			/>
		),
		Library: (
			<Table
				currentUser={currentUser}
				libraryBooks={libraryBooks}
				onAddSampleBook={handleAddToLibrary}
				onNavigate={setActivePage}
				onRemoveBook={handleRemoveLibraryBook}
				onUpdateBook={handleUpdateLibraryBook}
			/>
		),
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
