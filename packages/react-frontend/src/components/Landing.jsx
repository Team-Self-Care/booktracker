import { useState } from 'react';
import Book from './modals/Book';
import Navbar from './Navbar';
import Profile from './modals/Profile';
import Review from './modals/Review';
import '../style/css/index.css';

function Landing() {
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
					<a>Step In</a>
					<a>Learn More</a>
				</div>
			</section>

			<section className="modals">
				<Profile user="Ashley K." reviews={48} average={4.2} />

				<Book
					title="The Hobbit"
					author="J. R. R. Tolkein"
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
