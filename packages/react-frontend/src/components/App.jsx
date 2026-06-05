import { useEffect, useState } from 'react';
import Landing from './Landing';
import Navbar from './Navbar';
import Reviews from './Reviews';
import Search from './Search';
import Table from './Library';
import UserPage from './UserPage';
import { fetchBooks, addBook, updateBook, deleteBook } from '../book';
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

	//load books when user logs in
	useEffect(() => {
		if (currentUser && currentUser._id) {
			fetchBooks(currentUser._id)
				.then((books) => setLibraryBooks(books))
				.catch((error) => console.log('Failed to load books: ' + error));
		} else {
			setLibraryBooks([]);
		}
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

	const handleAddToLibrary = async (book, status = 'Want to read') => {
		console.log('Current user object:', currentUser);
		console.log('Current user ID:', currentUser?._id);
		console.log('Current user id (lowercase):', currentUser.id);

		const bookId = book.id ?? `${book.title}-${book.author}`;

		try {
			const newBook = await addBook({
				id: bookId,
				title: book.title,
				author: book.author,
				description: book.description || '',
				meta: book.meta || '',
				publishedDate: book.publishedDate || '',
				rating: book.rating || '',
				tag: book.tag || '',
				thumbnail: book.thumbnail || '',
				status: status,
				progress: 0,
				notes: '',
				isFavorite: false,
				userId: currentUser._id,
			});

			//refresh books from backend
			const books = await fetchBooks(currentUser._id);
			setLibraryBooks(books);
		} catch (error) {
			console.log('Failed to add book: ' + error);
		}
	};

	const handleUpdateLibraryBook = async (bookId, updates) => {
		try {
			await updateBook(bookId, updates);
			const books = await fetchBooks(currentUser._id);
			setLibraryBooks(books);
		} catch (error) {
			console.log('Failed to update book: ' + error);
		}
	};

	const handleRemoveLibraryBook = async (bookId) => {
		try {
			await deleteBook(bookId);
			const books = await fetchBooks(currentUser._id);
			setLibraryBooks(books);
		} catch (error) {
			console.log('Failed to delete book: ' + error);
		}
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
