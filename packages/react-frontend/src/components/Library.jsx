import React from 'react';
import '../style/css/index.css';
const filters = [
	'4+ rating',
	'Quest',
	'Found family',
	'Fantasy',
	'Cozy',
	'Coming of age',
];
const testbooks = [
	{
		Title: 'Lord of the Rings ',
		Author: 'J.R.R Tolkin ',
		Genre: 'Adult Fantasy ',
		Trope: 'Found Family ',
		Status: 'Complete ',
		Start_Date: '04/23/26 ',
		End_Date: '05/22/26 ',
		Reading_Level: '11th grade + ',
	},
	{
		Title: 'Pride and Prejudice ',
		Author: 'Jane Austen ',
		Genre: 'Historical Fiction ',
		Trope: 'Enemies to Lovers ',
		Status: 'Complete ',
		Start_Date: '04/23/26 ',
		End_Date: '05/22/26 ',
		Reading_Level: '9th grade + ',
	},
	{
		Title: 'Six of Crows ',
		Author: 'Leigh Bardugo ',
		Genre: 'YA Fantasy ',
		Trope: 'found family ',
		Status: 'Complete ',
		Start_Date: '04/23/26 ',
		End_Date: '05/22/26 ',
		Reading_Level: '7th grade + ',
	},

	{
		Title: 'The Hunger Games',
		Author: 'Susan Collins ',
		Genre: 'YA Fantasy ',
		Trope: 'Distopia ',
		Status: 'Complete ',
		Start_Date: '06/23/24 ',
		End_Date: '07/22/24 ',
		Reading_Level: '7th grade + ',
	},
];

function Table({ currentUser, onNavigate }) {
	return (
		<main className="page-wrap">
			<section className="web-page search-page">
				<header className="page-header">
					<div>
						<p>Library</p>
						<h1>Track Your Reading.</h1>
					</div>
				</header>

				<div className="search-layout">
					<aside className="search-panel">
						<form className="search-form">
							<label>
								Title
								<input defaultValue=" " />
							</label>
							<label>
								Author
								<input defaultValue=" " />
							</label>
							<label>
								Start_Date
								<input defaultValue=" " />
							</label>
							<label>
								End_Date
								<input defaultValue=" " />
							</label>
							<label>
								Status
								<input defaultValue=" " />
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
							Search Library
						</button>
					</aside>

					<section className="results-panel">
						<div className="section-heading">
							<span>{testbooks.length} books</span>
						</div>
						<div className="result-list">
							{testbooks.map((book) => (
								<article className="book-result" key={book.Title}>
									<div className="cover-block" />
									<div>
										<h3>{book.Title}</h3>
										<p>
											{book.Author} . {book.Genre}
										</p>
										<span>{book.Status}</span>
										<span>{book.Start_Date}</span>
										<span>{book.End_Date}</span>
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

export default Table;
