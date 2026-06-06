import { useState, useEffect } from 'react';
import { fetchReviews, addReview, deleteReview } from '../review';

const publicReviews = [
	{
		title: 'The Hobbit',
		body: 'A cozy adventure with enough danger to keep the group talking.',
		comments: 3,
		rating: 4.7,
		username: 'Avery M.',
	},
	{
		title: 'The Hobbit',
		body: 'The quest structure makes it easy to split into weekly discussion goals.',
		comments: 2,
		rating: 4.5,
		username: 'Mina K.',
	},
	{
		title: 'The Starless Sea',
		body: 'Best for readers who like layered stories, secret doors, and slow-burn mystery.',
		comments: 12,
		rating: 4.8,
		username: 'Avery M.',
	},
	{
		title: 'Legendborn',
		body: 'Strong public favorite for magic school, legacy, grief, and secret society tropes.',
		comments: 8,
		rating: 4.5,
		username: 'Mina K.',
	},
	{
		title: 'Circe',
		body: 'A character-driven myth retelling with a reflective pace and vivid voice.',
		comments: 15,
		rating: 4.6,
		username: 'Avery M.',
	},
];

function Reviews({ currentUser, onNavigate, readerReviews, setReaderReviews }) {
	const [addedUsers, setAddedUsers] = useState(['Avery M.', 'Mina K.']);
	const [selectedUser, setSelectedUser] = useState('All');
	const [userDraft, setUserDraft] = useState('');
	const [selectedBookTitle, setSelectedBookTitle] = useState(null);
	const [reviewDraft, setReviewDraft] = useState({
		title: '',
		body: '',
		rating: '5',
	});

	const [reviews, setReviews] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadReviews = async () => {
		setIsLoading(true);
		try {
			const data = await fetchReviews();
			setReviews(data);
		} catch (error) {
			console.log('Failed to load reviews: ' + error);
		} finally {
			setIsLoading(false);
		}
	};

	const currentUserInList =
		currentUser && !addedUsers.includes(currentUser.username)
			? [currentUser.username]
			: [];
	const availableUsers = [...currentUserInList, ...addedUsers];
	const allReviews = [...reviews];
	const visibleReviews =
		selectedUser === 'All'
			? allReviews
			: allReviews.filter((review) => review.username === selectedUser);
	const selectedBookComments = selectedBookTitle
		? allReviews.filter((review) => review.title === selectedBookTitle)
		: [];
	const featuredUser =
		availableUsers.find((user) => user === selectedUser) ?? availableUsers[0];
	const userInitials = currentUser
		? currentUser.username.slice(0, 2).toUpperCase()
		: 'JL';

	useEffect(() => {
		if (currentUser) {
			loadReviews();
		}
	}, [currentUser]);
	const handleChange = (event) => {
		setReviewDraft({
			...reviewDraft,
			[event.target.name]: event.target.value,
		});
	};

	const handleAddUser = (event) => {
		event.preventDefault();

		const username = userDraft.trim();

		if (!username || availableUsers.includes(username)) {
			setUserDraft('');
			return;
		}

		setAddedUsers([...addedUsers, username]);
		setSelectedUser(username);
		setUserDraft('');
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!currentUser) {
			onNavigate('Account');
			return;
		}

		if (!reviewDraft.title.trim() || !reviewDraft.body.trim()) {
			return;
		}

		try {
			await addReview({
				title: reviewDraft.title.trim(),
				body: reviewDraft.body.trim(),
				rating: Number(reviewDraft.rating),
				username: currentUser.username,
			});

			await loadReviews();

			const newReview = {
				body: reviewDraft.body.trim(),
				comments: 0,
				createdAt: new Date().toISOString(),
				rating: Number(reviewDraft.rating),
				title: reviewDraft.title.trim(),
				username: currentUser.username,
			};

			setReaderReviews((reviews) => [newReview, ...reviews]);

			if (!addedUsers.includes(currentUser.username)) {
				setAddedUsers((users) => [currentUser.username, ...users]);
			}

			setSelectedUser('All');
			setSelectedBookTitle(newReview.title);
			setReviewDraft({
				title: '',
				body: '',
				rating: '5',
			});
		} catch (error) {
			console.log('Failed to add review: ' + error);
		}
	};

	const handleDeleteReview = async (reviewId) => {
		try {
			await deleteReview(reviewId);
			await loadReviews();
		} catch (error) {
			console.log('Failed to delete review: ' + error);
		}
	};

	const handleUseReviewTitle = (title) => {
		setReviewDraft((draft) => ({
			...draft,
			title,
		}));
		setSelectedBookTitle(title);
	};

	return (
		<main className="page-wrap">
			<section className="web-page reviews-page">
				<header className="page-header">
					<div>
						<p>Reviews</p>
						<h1>See what your circle is reading.</h1>
					</div>
					<div className="avatar">{userInitials}</div>
				</header>

				<div className="reviews-layout">
					<aside className="review-sidebar">
						<article className="reviewer-card">
							<div className="reviewer-avatar">
								{featuredUser.slice(0, 2).toUpperCase()}
							</div>
							<div>
								<h2>{featuredUser}</h2>
								<p>
									{
										allReviews.filter(
											(review) => review.username === featuredUser
										).length
									}{' '}
									public reviews
								</p>
								<button
									onClick={() => setSelectedUser(featuredUser)}
									type="button"
								>
									View reviews
								</button>
							</div>
						</article>

						<section className="stack-section">
							<h2>Added users</h2>
							<div className="chip-row">
								<button
									className={selectedUser === 'All' ? 'chip is-active' : 'chip'}
									onClick={() => setSelectedUser('All')}
									type="button"
								>
									All
								</button>
								{availableUsers.map((user) => (
									<button
										className={
											selectedUser === user ? 'chip is-active' : 'chip'
										}
										key={user}
										onClick={() => setSelectedUser(user)}
										type="button"
									>
										{user}
									</button>
								))}
							</div>
							<form className="add-user-form" onSubmit={handleAddUser}>
								<input
									onChange={(event) => setUserDraft(event.target.value)}
									placeholder="Add username"
									value={userDraft}
								/>
								<button type="submit">+ User</button>
							</form>
						</section>
					</aside>

					<section className="review-board">
						<form className="review-composer" onSubmit={handleSubmit}>
							<div>
								<h2>Write a review</h2>
								<p>
									{currentUser
										? `Posting as ${currentUser.username}`
										: 'Log in first to post comments and ratings.'}
								</p>
							</div>
							<div className="composer-grid">
								<label>
									Book title
									<input
										name="title"
										onChange={handleChange}
										placeholder="The Hobbit"
										value={reviewDraft.title}
									/>
								</label>
								<label>
									Rating
									<input
										max="5"
										min="1"
										name="rating"
										onChange={handleChange}
										type="number"
										value={reviewDraft.rating}
									/>
								</label>
							</div>
							<label>
								Comment
								<textarea
									name="body"
									onChange={handleChange}
									placeholder="What should other readers know?"
									value={reviewDraft.body}
								/>
							</label>
							<div className="composer-actions">
								{!currentUser && (
									<button onClick={() => onNavigate('Account')} type="button">
										Log in to review
									</button>
								)}
								<button className="primary-action" type="submit">
									Post review
								</button>
							</div>
						</form>

						{selectedBookTitle && (
							<section className="comment-panel">
								<header>
									<div>
										<p>Comments for</p>
										<h2>{selectedBookTitle}</h2>
									</div>
									<button
										onClick={() => setSelectedBookTitle(null)}
										type="button"
									>
										Close
									</button>
								</header>
								<div className="comment-list">
									{selectedBookComments.map((review, index) => (
										<article
											className="comment-card"
											key={`${review.username}-${review.title}-${index}`}
										>
											<div className="comment-avatar">
												{review.username.slice(0, 2).toUpperCase()}
											</div>
											<div>
												<h3>{review.username}</h3>
												<p>{review.body}</p>
												<span>{review.rating} rating</span>
											</div>
										</article>
									))}
								</div>
							</section>
						)}

						<div className="section-heading">
							<div>
								<h2>Public Comments</h2>
								<p>
									{selectedUser === 'All'
										? 'Recent notes from readers you follow.'
										: `Only showing reviews by ${selectedUser}.`}
								</p>
							</div>
							<span>{visibleReviews.length} updates</span>
						</div>
						<div className="review-feed">
							{visibleReviews.map((review, index) => {
								return (
									<article
										className="feed-card"
										key={`${review.username}-${review.title}-${index}`}
									>
										<span className="review-author">{review.username}</span>
										<h3>{review.title}</h3>
										<p>{review.body}</p>
										<footer>
											<span>
												{review.comments} comments . {review.rating} rating
											</span>
											<button
												onClick={() => handleUseReviewTitle(review.title)}
												type="button"
											>
												Comment
											</button>
											{currentUser &&
												review.username === currentUser.username && (
													<button
														onClick={() => {
															handleDeleteReview(review._id);
														}}
														type="button"
													>
														Remove
													</button>
												)}
										</footer>
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

export default Reviews;
