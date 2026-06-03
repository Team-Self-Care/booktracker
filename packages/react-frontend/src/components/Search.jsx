const filters = [
	'4+ rating',
	'Quest',
	'Found family',
	'Fantasy',
	'Cozy',
	'Coming of age',
];

const results = [
	{
		title: 'The Hobbit',
		author: 'J. R. R. Tolkien',
		meta: '310 pages',
		rating: '4.7',
		tag: 'Quest',
	},
	{
		title: 'Piranesi',
		author: 'Susanna Clarke',
		meta: 'Fantasy',
		rating: '4.6',
		tag: 'Dreamlike',
	},
	{
		title: 'A Wizard of Earthsea',
		author: 'Ursula K. Le Guin',
		meta: 'Classic fantasy',
		rating: '4.5',
		tag: 'School',
	},
];

function Search({ currentUser, onNavigate }) {
	const userInitials = currentUser
		? currentUser.username.slice(0, 2).toUpperCase()
		: 'JL';

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
						<form className="search-form">
							<label>
								Title
								<input defaultValue="The Hobbit" />
							</label>
							<label>
								Author
								<input defaultValue="J. R. R. Tolkien" />
							</label>
							<label>
								Reading level
								<input defaultValue="Middle grade / YA" />
							</label>
						</form>

						<section className="stack-section">
							<h2>Filters</h2>
							<div className="chip-row">
								{filters.map((filter) => (
									<button className="chip" key={filter} type="button">
										{filter}
									</button>
								))}
							</div>
						</section>

						<button className="primary-action" type="button">
							Search Google + reviews
						</button>
					</aside>

					<section className="results-panel">
						<div className="section-heading">
							<div>
								<h2>Results</h2>
								<p>Books that match your reading group mood.</p>
							</div>
							<span>{results.length} books</span>
						</div>
						<div className="result-list">
							{results.map((book) => (
								<article className="book-result" key={book.title}>
									<div className="cover-block" />
									<div>
										<h3>{book.title}</h3>
										<p>
											{book.author} . {book.meta}
										</p>
										<span>{book.tag}</span>
									</div>
									<div className="result-actions">
										<strong>{book.rating}</strong>
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
							))}
						</div>
					</section>
				</div>
			</section>
		</main>
	);
}

export default Search;
