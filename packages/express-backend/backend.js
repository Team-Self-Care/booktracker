// backend.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
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
		.catch((error) => res.status(500).send({ error: error.message }));
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
				res.status(404).send({ error: 'User not found' });
			}
		})
		.catch((error) => res.status(500).send({ error: error.message }));
});

app.post('/users', async(req, res) => {
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
		res.status(400).send({ error: 'Name, email, and password required' });
		return;
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const { db } = await connectDB();
		const result = await db.collection('users').insertOne({
			name,
			email,
			password: hashedPassword
		});
		
		res.status(201).send({id: result.insertedId, name: name});

	}
	catch(error){
		res.status(500).send({error: error.message});
	}
});

app.post('/login', async(req, res) => {
	//login user
	const { email, password } = req.body;

	if(!email || !password){
		return res.status(400).send({error: 'Email and password required'});
	}

	try{
		const { db } = await connectDB();
		const user = await db.collection('users').findOne({email: email});

		if(user){
			const testPassword = await bcrypt.compare(password, user.password);
			if(testPassword){
				res.send({success: true, name: user.name});
			}
		}
		else{
			res.status(401).send({error: 'Invalid creditals'});
		}
	}
		
	catch(error){
		res.status(500).send({error: error.message});
	}
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
