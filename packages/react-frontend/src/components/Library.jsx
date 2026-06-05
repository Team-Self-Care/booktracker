import { useState } from 'react';
import '../style/css/index.css';

const statuses = ['Want to read', 'Reading', 'Finished', 'Paused'];

const sampleBooks = [
	{
		id: 'sample-lotr',
		title: 'The Lord of the Rings',
		author: 'J. R. R. Tolkien',
		description:
			'A long-form fantasy classic for readers who like maps, quests, and fellowship.',
		meta: 'Epic fantasy',
		publishedDate: '1954',
		rating: '4.8',
		tag: 'Found family',
		thumbnail: '',
	},
	{
		id: 'sample-pride',
		title: 'Pride and Prejudice',
		author: 'Jane Austen',
		description:
			'A sharp social romance with memorable dialogue and enduring character work.',
		meta: 'Classic fiction',
		publishedDate: '1813',
		rating: '4.6',
		tag: 'Romance',
		thumbnail: '',
	},
	{
		id: 'sample-crows',
		title: 'Six of Crows',
		author: 'Leigh Bardugo',
		description:
			'A fast ensemble heist with morally gray characters and strong group dynamics.',
		meta: 'YA fantasy',
		publishedDate: '2015',
		rating: '4.5',
		tag: 'Heist',
		thumbnail: '',
	},
];

function Library({
	currentUser,
	libraryBooks,
	onAddSampleBook,
	onNavigate,
	onRemoveBook,
	onUpdateBook,
}) {
	const [query, setQuery] = useState('');
	const userInitials = currentUser
		? currentUser.username.slice(0, 2).toUpperCase()
		: 'JL';
	const savedSampleIds = new Set(libraryBooks.map((book) => book.id));
	const activeBooks = libraryBooks.filter((book) => {
		const haystack =
			`${book.title} ${book.author} ${book.tag} ${book.status ?? ''}`.toLowerCase();
		return haystack.includes(query.toLowerCase());
	});
	const favoriteCount = libraryBooks.filter((book) => book.isFavorite).length;
	const readingCount = libraryBooks.filter(
		(book) => book.status === 'Reading'
	).length;
	const finishedCount = libraryBooks.filter(
		(book) => book.status === 'Finished'
	).length;

	const handleFilter = (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setQuery(formData.get('query').toString().trim());
	};

	const handleAddSample = (book) => {
		if (!currentUser) {
			onNavigate('Account');
			return;
		}

		onAddSampleBook(book, 'Want to read');
	};

	return (
		<main className="page-wrap">
			<section className="web-page search-page">
				<header className="page-header">
					<div>
						<p>Library</p>
						<h1>Track your reading shelf.</h1>
					</div>
					<div className="avatar">{userInitials}</div>
				</header>

				<div className="library-stats">
					<article>
						<strong>{libraryBooks.length}</strong>
						<span>saved books</span>
					</article>
					<article>
						<strong>{readingCount}</strong>
						<span>currently reading</span>
					</article>
					<article>
						<strong>{finishedCount}</strong>
						<span>finished</span>
					</article>
					<article>
						<strong>{favoriteCount}</strong>
						<span>favorites</span>
					</article>
				</div>

				<div className="search-layout">
					<aside className="search-panel">
						<form className="search-form" onSubmit={handleFilter}>
							<label>
								Search your library
								<input
									defaultValue={query}
									name="query"
									placeholder="Title, author, genre, status..."
								/>
							</label>
							<button className="primary-action" type="submit">
								Filter Library
							</button>
						</form>

						<section className="stack-section">
							<h2>Starter books</h2>
							<div className="sample-list">
								{sampleBooks.map((book) => (
									<button
										disabled={savedSampleIds.has(book.id)}
										key={book.id}
										onClick={() => handleAddSample(book)}
										type="button"
									>
										<span>{book.title}</span>
										<small>
											{savedSampleIds.has(book.id) ? 'Saved' : 'Add'}
										</small>
									</button>
								))}
							</div>
						</section>
					</aside>

					<section className="results-panel">
						<div className="section-heading">
							<div>
								<h2>My Books</h2>
								<p>Update progress, mark favorites, and keep private notes.</p>
							</div>
							<span>{activeBooks.length} books</span>
						</div>
						{!currentUser && (
							<p className="status-message">
								Log in to save books from Search and build your personal
								library.
							</p>
						)}
						{activeBooks.length === 0 ? (
							<div className="empty-state">
								<h2>No books here yet.</h2>
								<p>
									Search Google Books and save a title, or add one of the
									starter books from the left panel.
								</p>
								<button onClick={() => onNavigate('Search')} type="button">
									Go to Search
								</button>
							</div>
						) : (
							<div className="library-list">
								{activeBooks.map((book) => (
									<article className="library-book" key={book._id}>
										<div className="cover-block">
											{book.thumbnail ? (
												<img src={book.thumbnail} alt={`${book.title} cover`} />
											) : (
												<span>{book.title.slice(0, 1)}</span>
											)}
										</div>
										<div className="library-main">
											<header>
												<div>
													<h3>{book.title}</h3>
													<p>
														{book.author} . {book.meta}
													</p>
												</div>
												<button
													className={
														book.isFavorite ? 'favorite is-active' : 'favorite'
													}
													onClick={() =>
														onUpdateBook(book._id, {
															isFavorite: !book.isFavorite,
														})
													}
													type="button"
												>
													{book.isFavorite ? 'Liked' : 'Like'}
												</button>
											</header>
											<div className="library-controls">
												<label>
													Status
													<select
														onChange={(event) =>
															onUpdateBook(book._id, {
																status: event.target.value,
															})
														}
														value={book.status ?? 'Want to read'}
													>
														{statuses.map((status) => (
															<option key={status}>{status}</option>
														))}
													</select>
												</label>
												<label>
													Progress
													<input
														max="100"
														min="0"
														onChange={(event) =>
															onUpdateBook(book._id, {
																progress: Number(event.target.value),
															})
														}
														type="number"
														value={book.progress ?? 0}
													/>
												</label>
											</div>
											<label className="notes-field">
												Notes
												<textarea
													onChange={(event) =>
														onUpdateBook(book._id, {
															notes: event.target.value,
														})
													}
													placeholder="Private thoughts, group questions, or reminders..."
													value={book.notes ?? ''}
												/>
											</label>
											<footer>
												<span>{book.tag}</span>
												<button
													onClick={() => onNavigate('Reviews')}
													type="button"
												>
													Review
												</button>
												<button
													onClick={() => onRemoveBook(book._id)}
													type="button"
												>
													Remove
												</button>
											</footer>
										</div>
									</article>
								))}
							</div>
						)}
					</section>
				</div>
			</section>
		</main>
	);
}

export default Library;
