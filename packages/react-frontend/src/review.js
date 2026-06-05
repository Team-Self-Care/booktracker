const API_URL = 'http://localhost:8000';

//get all reviews
export async function fetchReviews() {
	const response = await fetch(`${API_URL}/reviews`);

	if (response.status === 200) {
		const data = await response.json();
		return data.reviews_list || [];
	} else {
		throw new Error('Failed to fetch reviews');
	}
}

//get reviews by username
export async function fetchReviewsByUser(username) {
	const response = await fetch(`${API_URL}/reviews/user/${username}`);

	if (response.status === 200) {
		const data = await response.json();
		return data.reviews_list || [];
	} else {
		throw new Error('Failed to fetch user reviews');
	}
}

//get reviews by book title
export async function fetchReviewsByBook(title) {
	const response = await fetch(
		`${API_URL}/reviews/book/${encodeURIComponent(title)}`
	); //stops the URL from breaking at special characters like spaces and &s in title of the book

	if (response.status === 200) {
		const data = await response.json();
		return data.reviews_list || [];
	} else {
		throw new Error('Failed to fetch book reviews');
	}
}

//add a new review
export async function addReview(reviewData) {
	const response = await fetch(`${API_URL}/reviews`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(reviewData),
	});

	if (response.status === 201) {
		return response.json();
	} else {
		throw new Error('Failed to add review');
	}
}

//delete a review
export async function deleteReview(reviewId) {
	const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
		method: 'DELETE',
	});

	if (response.status === 204) {
		return true;
	} else {
		throw new Error('Failed to delete review');
	}
}
