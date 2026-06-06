const API_URL =
	import.meta.env.VITE_API_URL ||
	'https://csc307-booktracker-hya2bfh2bgfxd2dk.eastus-01.azurewebsites.net';

async function readResponseBody(response) {
	const text = await response.text();

	if (!text) {
		return {};
	}

	try {
		return JSON.parse(text);
	} catch {
		return { message: text };
	}
}

function getErrorMessage(data, fallbackMessage) {
	if (typeof data === 'string') {
		return data;
	}

	return data?.message || data?.error || fallbackMessage;
}

export async function loginUser(email, password) {
	const response = await fetch(`${API_URL}/login`, {
		//sends a post request (for sending data)
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }), //converts JSON object into a string in order to send it
	});

	if (response.status === 200 || response.status === 201) {
		//200 = ok/success, 201 = created
		return readResponseBody(response);
	} else {
		const error = await readResponseBody(response);
		throw new Error(getErrorMessage(error, 'Login failed'));
	}
}

export async function registerUser(name, email, password) {
	const response = await fetch(`${API_URL}/users`, {
		//sends a post request
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, email, password }), //converts JSON object into a string in order to send it
	});

	if (response.status === 201) {
		//201 = created
		return readResponseBody(response);
	} else {
		const error = await readResponseBody(response);
		throw new Error(getErrorMessage(error, 'Registration failed'));
	}
}

export async function fetchUsers() {
	const response = await fetch(`${API_URL}/users`); //sends a get request
	if (response.status === 200) {
		return response.json(); //returns list of users, js object
	} else {
		throw new Error('Failed to fetch users');
	}
}

export async function fetchUserByName(name) {
	const response = await fetch(`${API_URL}/users/${name}`);
	if (response.status === 200) {
		return response.json();
	} else if (response.status === 404) {
		throw new Error('User not found');
	} else {
		throw new Error('Failed to fetch user');
	}
}

export async function deleteUserByName(name) {
	const response = await fetch(`${API_URL}/users/${name}`, {
		//delete request
		method: 'DELETE',
	});
	if (response.status === 204) {
		//204 = no content
		return true;
	} else if (response.status === 404) {
		throw new Error('User not found');
	} else {
		throw new Error('Delete failed');
	}
}
