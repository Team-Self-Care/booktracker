const API_URL = 'https://csc307-booktracker-hya2bfh2bgfxd2dk.eastus-01.azurewebsites.net';

//get all books for a user
export async function fetchBooks(userId) {
	let url;
	if (userId) {
		url = `${API_URL}/books?userId=${userId}`;
	} else {
		url = `${API_URL}/books`;
	}
	const response = await fetch(url);

	if (response.status === 200) {
		const data = await response.json();
		return data.books_list || [];
	} else {
		throw new Error('Failed to fetch books');
	}
}

//add a new book
export async function addBook(bookData) {
	const response = await fetch(`${API_URL}/books`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(bookData),
	});

	if (response.status === 201) {
		return response.json();
	} else {
		throw new Error('Failed to add book');
	}
}

//update a book
export async function updateBook(bookId, updates) {
	const response = await fetch(`${API_URL}/books/${bookId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(updates),
	});

	if (response.status === 200) {
		return { success: true };
	} else {
		throw new Error('Failed to update book');
	}
}

//delete a book
export async function deleteBook(bookId) {
	const response = await fetch(`${API_URL}/books/${bookId}`, {
		method: 'DELETE',
	});

	if (response.status === 204) {
		return true;
	} else {
		throw new Error('Failed to delete book');
	}
}
