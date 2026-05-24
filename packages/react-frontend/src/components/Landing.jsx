import Book from './modals/Book';
import Profile from './modals/Profile';
import Review from './modals/Review';
import '../style/css/index.css';

function Landing({ onNavigate }) {
	return (
		<main className="landing">
			<section className="info">
				<h1>Find your new</h1>
				<h2>book club.</h2>

				<p>
					<span>booktracker</span> is your personal book club organizer,
					librarian, and social community of readers, all under one cover.
				</p>
				<div className="buttons">
					<button onClick={() => onNavigate('Search')} type="button">
						Step In
					</button>
					<button onClick={() => onNavigate('Reviews')} type="button">
						Learn More
					</button>
				</div>
			</section>

			<section className="modals">
				<Profile user="Ashley K." reviews={48} average={4.2} />

				<Book
					title="The Hobbit"
					author="J. R. R. Tolkien"
					tag="Literary Fantasy"
					genres={['Fantasy', 'Adventure']}
				/>

				<Review
					title="The Starless Seas"
					review="Best for readers who like layered stories, secret doors, and slow-burn mystery."
					comments={12}
					rating={4.8}
				/>
			</section>
		</main>
	);
}

export default Landing;
