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
	connectDB()
		.then(({ db }) => db.collection('users').find({}).toArray())
		.then((result) => res.send({ users_list: result }))
		.catch((error) => res.status(500).send({ error: error.message }));
});

app.get('/users/:name', (req, res) => {
	const name = req.params['name'];
	connectDB()
		.then(({ db }) => db.collection('users').findOne({ name: name }))
		.then((result) => {
			if (result) {
				res.send({ user: result });
			} else {
				res.status(404).send({ error: 'User not found' });
			}
		})
		.catch((error) => res.status(500).send({ error: error.message }));
});

app.post('/users', (req, res) => {
	const { name, password } = req.body;

	if (
		name === undefined ||
		name === '' ||
		password === undefined ||
		password === ''
	) {
		res.status(400).send({ error: 'Name and password required' });
		return;
	}

	connectDB()
		.then(({ db }) => db.collection('users').insertOne({ name, password }))
		.then((result) =>
			res.status(201).send({ id: result.insertedId, name: name })
		)
		.catch((error) => res.status(500).send({ error: error.message }));
});

app.post('/login', (req, res) => {
	const { name, password } = req.body;

	connectDB()
		.then(({ db }) =>
			db.collection('users').findOne({ name: name, password: password })
		)
		.then((user) => {
			if (user) {
				res.send({ success: true, name: user.name });
			} else {
				res.status(401).send({ error: 'Invalid credentials' });
			}
		})
		.catch((error) => res.status(500).send({ error: error.message }));
});

app.delete('/users/:name', (req, res) => {
	const name = req.params['name'];

	connectDB()
		.then(({ db }) => db.collection('users').deleteOne({ name: name }))
		.then((result) => {
			if (result.deletedCount === 1) {
				res.status(204).end();
			} else {
				res.status(404).send({ error: 'User not found' });
			}
		})
		.catch((error) => res.status(500).send({ error: error.message }));
});

app.listen(port, () => {
	console.log(`REST API is listening on port ${port}`);
});
