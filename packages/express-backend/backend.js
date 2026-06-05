// backend.js

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors()); //enables all cors requests
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Booktracker Users is running');
});

app.get('/users', (req, res) => {
	//get all users
	connectDB()
		.then(({ db }) => db.collection('users').find({}).toArray())
		.then((result) => res.send({ users_list: result }))
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.get('/users/:name', (req, res) => {
	//get user by name
	const name = req.params['name'];
	connectDB()
		.then(({ db }) => db.collection('users').findOne({ name: name }))
		.then((result) => {
			if (result) {
				res.send({ user: result });
			} else {
				res.status(404).send('User not found');
			}
		})
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.post('/users', (req, res) => {
	//register a new user (with email, name, password)
	const { name, email, password } = req.body;

	if (
		name === undefined ||
		name === '' ||
		password === undefined ||
		password === '' ||
		email === undefined ||
		email === ''
	) {
		res.status(400).send('Name, email, and password required');
		return;
	}

	connectDB()
		.then(({ db }) =>
			db.collection('users').insertOne({ name, email, password })
		)
		.then((result) =>
			res.status(201).send({
				id: result.insertedId,
				name: name,
				_id: result.insertedId.toString(),
			})
		)
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.post('/login', (req, res) => {
	//login user
	const { email, password } = req.body;

	connectDB()
		.then(({ db }) =>
			db.collection('users').findOne({ email: email, password: password })
		)
		.then((user) => {
			if (user) {
				res.send({ success: true, name: user.name, _id: user._id.toString() });
			} else {
				res.status(401).send('Invalid credentials');
			}
		})
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.delete('/users/:name', (req, res) => {
	const name = req.params['name'];

	connectDB()
		.then(({ db }) => db.collection('users').deleteOne({ name: name }))
		.then((result) => {
			if (result.deletedCount === 1) {
				res.status(204).end();
			} else {
				res.status(404).send('User not found');
			}
		})
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.get('/books', (req, res) => {
	//get all books
	const { userId } = req.query;

	let query = {};
	if (userId) {
		query.userId = userId;
	}

	connectDB()
		.then(({ db }) => db.collection('books').find(query).toArray())
		.then((result) => res.send({ books_list: result }))
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.post('/books', (req, res) => {
	//add a new book to library
	const {
		title,
		author,
		description,
		meta,
		publishedDate,
		rating,
		tag,
		thumbnail,
		status,
		progress,
		notes,
		isFavorite,
		userId,
	} = req.body;

	if (
		title === undefined ||
		title === '' ||
		author === undefined ||
		author === ''
	) {
		res.status(400).send('Title and author are required');
		return;
	}

	connectDB()
		.then(({ db }) =>
			db.collection('books').insertOne({
				title: title,
				author: author,
				description: description || '',
				meta: meta || '',
				publishedDate: publishedDate || '',
				rating: rating || '',
				tag: tag || '',
				thumbnail: thumbnail || '',
				status: status || 'Want to read',
				progress: progress || 0,
				notes: notes || '',
				isFavorite: isFavorite || false,
				userId: userId || null,
				createdAt: new Date(),
			})
		)
		.then((result) =>
			res.status(201).send({ id: result.insertedId, title: title })
		)
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.put('/books/:bookId', (req, res) => {
	// update an existing book
	const bookId = req.params['bookId'];
	const { status, progress, notes, isFavorite } = req.body;
	const updateFields = {};
	if (status !== undefined) {
		updateFields.status = status;
	}
	if (progress !== undefined) {
		updateFields.progress = progress;
	}
	if (notes !== undefined) {
		updateFields.notes = notes;
	}
	if (isFavorite !== undefined) {
		updateFields.isFavorite = isFavorite;
	}

	connectDB()
		.then(({ db }) => {
			const { ObjectId } = require('mongodb');
			return db
				.collection('books')
				.updateOne({ _id: new ObjectId(bookId) }, { $set: updateFields });
		})
		.then((result) => {
			if (result.matchedCount === 1) {
				res.status(200).send('Book updated successfully');
			} else {
				res.status(404).send('Book not found');
			}
		})
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.delete('/books/:bookId', (req, res) => {
	//delete a book from the library
	const bookId = req.params['bookId'];

	connectDB()
		.then(({ db }) => {
			const { ObjectId } = require('mongodb');
			return db.collection('books').deleteOne({ _id: new ObjectId(bookId) });
		})
		.then((result) => {
			if (result.deletedCount === 1) {
				res.status(204).end();
			} else {
				res.status(404).send('Book not found');
			}
		})
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.get('/reviews', (req, res) => {
	//get all reviews
	connectDB()
		.then(({ db }) => db.collection('reviews').find({}).toArray())
		.then((result) => res.send({ reviews_list: result }))
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.get('/reviews/user/:username', (req, res) => {
	//get review by username
	const username = req.params['username'];

	connectDB()
		.then(({ db }) =>
			db.collection('reviews').find({ username: username }).toArray()
		)
		.then((result) => res.send({ reviews_list: result }))
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.get('/reviews/book/:title', (req, res) => {
	//get reviews by title
	const title = req.params['title'];

	connectDB()
		.then(({ db }) => db.collection('reviews').find({ title: title }).toArray())
		.then((result) => res.send({ reviews_list: result }))
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.post('/reviews', (req, res) => {
	//add new review
	const { title, body, rating, username } = req.body;

	if (
		title === undefined ||
		title === '' ||
		body === undefined ||
		body === '' ||
		rating === undefined ||
		rating === '' ||
		username === undefined ||
		username === ''
	) {
		res.status(400).send('Title, body, rating, and username are required');
		return;
	}

	connectDB()
		.then(({ db }) =>
			db.collection('reviews').insertOne({
				title: title,
				body: body,
				rating: Number(rating),
				username: username,
				comments: 0,
				createdAt: new Date(),
			})
		)
		.then((result) =>
			res.status(201).send({ id: result.insertedId, title: title })
		)
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.delete('/reviews/:id', (req, res) => {
	//delete revirw
	const id = req.params['id'];

	connectDB()
		.then(({ db }) => {
			const { ObjectId } = require('mongodb');
			return db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
		})
		.then((result) => {
			if (result.deletedCount === 1) {
				res.status(204).end();
			} else {
				res.status(404).send('Review not found');
			}
		})
		.catch((error) => {
			console.log('Database error: ' + error);
			res.status(500).send('An error ocurred in the server.');
		});
});

app.listen(process.env.PORT || port, () => {
	console.log(`REST API is listening on port ${port}`);
});
