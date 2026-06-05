import { useState } from 'react';

const filters = [
	'Fantasy',
	'Classic',
	'Young adult',
	'Mystery',
	'Romance',
	'History',
];

const starterResults = [
	{
		id: 'starter-hobbit',
		title: 'The Hobbit',
		author: 'J. R. R. Tolkien',
		description:
			'A compact adventure with dragons, riddles, maps, and a very reluctant burglar.',
		meta: 'Classic fantasy',
		publishedDate: '1937',
		rating: '4.7',
		tag: 'Quest',
		thumbnail: '',
	},
	{
		id: 'starter-piranesi',
		title: 'Piranesi',
		author: 'Susanna Clarke',
		description:
			'A strange, beautiful house full of halls, tides, statues, and unreliable memory.',
		meta: 'Fantasy',
		publishedDate: '2020',
		rating: '4.6',
		tag: 'Dreamlike',
		thumbnail: '',
	},
	{
		id: 'starter-earthsea',
		title: 'A Wizard of Earthsea',
		author: 'Ursula K. Le Guin',
		description:
			'A thoughtful coming-of-age fantasy about power, names, fear, and repair.',
		meta: 'Classic fantasy',
		publishedDate: '1968',
		rating: '4.5',
		tag: 'School',
		thumbnail: '',
	},
];

const mapGoogleBook = (item) => {
	const volume = item.volumeInfo ?? {};
	const imageLinks = volume.imageLinks ?? {};
	const categories = volume.categories ?? [];

	return {
		id: item.id,
		title: volume.title ?? 'Untitled book',
		author: volume.authors?.join(', ') ?? 'Unknown author',
		description:
			volume.description?.replace(/<[^>]*>/g, '') ??
			'No description available from Google Books yet.',
		meta:
			[volume.pageCount ? `${volume.pageCount} pages` : '', categories[0] ?? '']
				.filter(Boolean)
				.join(' . ') || 'Book',
		publishedDate: volume.publishedDate ?? '',
		rating: volume.averageRating ? volume.averageRating.toFixed(1) : 'New',
		source: 'Google Books',
		tag: categories[0]?.split('/')[0] ?? 'Book',
		thumbnail: imageLinks.thumbnail?.replace('http://', 'https://') ?? '',
	};
};

const mapOpenLibraryBook = (item) => {
	const coverId = item.cover_i;
	const subjects = item.subject?.slice(0, 2) ?? [];
	const publishYear = item.first_publish_year;

	return {
		id: item.key ? `open-library-${item.key}` : `open-library-${item.title}`,
		title: item.title ?? 'Untitled book',
		author: item.author_name?.join(', ') ?? 'Unknown author',
		description:
			subjects.length > 0
				? `Open Library lists this book with ${subjects.join(', ')}.`
				: 'No description available from Open Library yet.',
		meta:
			[
				publishYear ? `First published ${publishYear}` : '',
				item.edition_count ? `${item.edition_count} editions` : '',
			]
				.filter(Boolean)
				.join(' . ') || 'Book',
		publishedDate: publishYear ? String(publishYear) : '',
		rating: 'Open',
		source: 'Open Library',
		tag: subjects[0] ?? 'Book',
		thumbnail: coverId
			? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
			: '',
	};
};

const searchGoogleBooks = async (searchParts) => {
	const response = await fetch(
		`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
			searchParts.join(' ')
		)}&maxResults=12&printType=books`
	);

	if (!response.ok) {
		throw new Error(response.status === 429 ? 'GOOGLE_QUOTA' : 'GOOGLE_ERROR');
	}

	const data = await response.json();
	return data.items?.map(mapGoogleBook) ?? [];
};

const searchOpenLibrary = async ({ activeFilter, author, query, subject }) => {
	const params = new URLSearchParams({
		limit: '12',
	});
	const titleQuery = query.trim();
	const authorQuery = author.trim();
	const subjectQuery = subject.trim() || activeFilter;

	if (titleQuery) {
		params.set('title', titleQuery);
	} else if (subjectQuery) {
		params.set('q', subjectQuery);
	}

	if (authorQuery) {
		params.set('author', authorQuery);
	}

	if (subjectQuery) {
		params.set('subject', subjectQuery);
	}

	const response = await fetch(
		`https://openlibrary.org/search.json?${params.toString()}`
	);

	if (!response.ok) {
		throw new Error('OPEN_LIBRARY_ERROR');
	}

	const data = await response.json();
	return data.docs?.map(mapOpenLibraryBook) ?? [];
};

function Search({ currentUser, libraryBooks, onAddToLibrary, onNavigate }) {
	const [query, setQuery] = useState('The Hobbit');
	const [author, setAuthor] = useState('');
	const [subject, setSubject] = useState('');
	const [activeFilter, setActiveFilter] = useState('');
	const [results, setResults] = useState(starterResults);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState('');

	const userInitials = currentUser
		? currentUser.username.slice(0, 2).toUpperCase()
		: 'JL';

	const savedBookIds = new Set(libraryBooks.map((book) => book.id));

	const handleSearch = async (event) => {
		event.preventDefault();

		const searchParts = [
			query.trim(),
			author.trim() ? `inauthor:${author.trim()}` : '',
			subject.trim() ? `subject:${subject.trim()}` : '',
			activeFilter ? `subject:${activeFilter}` : '',
		].filter(Boolean);

		if (searchParts.length === 0) {
			return;
		}

		setIsSearching(true);
		setError('');

		try {
			const nextResults = await searchGoogleBooks(searchParts);

			setResults(nextResults);
			if (nextResults.length === 0) {
				setError('No books found. Try a broader title, author, or genre.');
			}
		} catch (googleError) {
			try {
				const fallbackResults = await searchOpenLibrary({
					activeFilter,
					author,
					query,
					subject,
				});

				setResults(fallbackResults);
				setError(
					googleError.message === 'GOOGLE_QUOTA'
						? 'Google Books quota is exhausted today, so results are coming from Open Library.'
						: 'Google Books is unavailable, so results are coming from Open Library.'
				);

				if (fallbackResults.length === 0) {
					setError('No books found. Try a broader title, author, or genre.');
				}
			} catch {
				setError(
					'Search is unavailable right now. Google Books is limited and Open Library could not be reached.'
				);
			}
		} finally {
			setIsSearching(false);
		}
	};

	const handleAddBook = (book) => {
		if (!currentUser) {
			onNavigate('Account');
			return;
		}

		onAddToLibrary(book, 'Want to read');
	};

	return (
		<main className="page-wrap">
			<section className="web-page search-page">
				<header className="page-header">
					<div>
						<p>Search</p>
						<h1>Find your next shared read.</h1>
					</div>
					<div className="avatar">{userInitials}</div>
				</header>

				<div className="search-layout">
					<aside className="search-panel">
						<form className="search-form" onSubmit={handleSearch}>
							<label>
								Title or keyword
								<input
									onChange={(event) => setQuery(event.target.value)}
									placeholder="The Hobbit"
									value={query}
								/>
							</label>
							<label>
								Author
								<input
									onChange={(event) => setAuthor(event.target.value)}
									placeholder="J. R. R. Tolkien"
									value={author}
								/>
							</label>
							<label>
								Genre or subject
								<input
									onChange={(event) => setSubject(event.target.value)}
									placeholder="Fantasy, memoir, history..."
									value={subject}
								/>
							</label>
							<section className="stack-section">
								<h2>Quick filters</h2>
								<div className="chip-row">
									{filters.map((filter) => (
										<button
											className={
												activeFilter === filter ? 'chip is-active' : 'chip'
											}
											key={filter}
											onClick={() =>
												setActiveFilter(activeFilter === filter ? '' : filter)
											}
											type="button"
										>
											{filter}
										</button>
									))}
								</div>
							</section>
							<button
								className="primary-action"
								disabled={isSearching}
								type="submit"
							>
								{isSearching ? 'Searching...' : 'Search Google Books'}
							</button>
						</form>
					</aside>

					<section className="results-panel">
						<div className="section-heading">
							<div>
								<h2>Results</h2>
								<p>
									Search Google Books first, then Open Library if Google is
									limited.
								</p>
							</div>
							<span>{results.length} books</span>
						</div>
						{error && <p className="status-message">{error}</p>}
						<div className="result-list">
							{results.map((book) => {
								const isSaved = savedBookIds.has(book.id);

								return (
									<article className="book-result" key={book.id}>
										<div className="cover-block">
											{book.thumbnail ? (
												<img src={book.thumbnail} alt={`${book.title} cover`} />
											) : (
												<span>{book.title.slice(0, 1)}</span>
											)}
										</div>
										<div>
											<h3>{book.title}</h3>
											<p>
												{book.author} . {book.meta}
											</p>
											<p className="book-summary">{book.description}</p>
											<span>{book.tag}</span>
											<span>{book.source ?? 'Starter result'}</span>
										</div>
										<div className="result-actions">
											<strong>{book.rating}</strong>
											<button
												disabled={isSaved}
												onClick={() => handleAddBook(book)}
												type="button"
											>
												{isSaved ? 'Saved' : 'Save'}
											</button>
											<button
												onClick={() =>
													onNavigate(currentUser ? 'Reviews' : 'Account')
												}
												type="button"
											>
												Review
											</button>
										</div>
									</article>
								);
							})}
						</div>
					</section>
				</div>
			</section>
		</main>
	);
}

export default Search;
