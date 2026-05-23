import React, { useState } from 'react';

function Form(props) {
	const [person, setPerson] = useState({
		user_name: '',
		password: '',
	});

	function handleChange(event) {
		const { name, value } = event.target;
		if (name === 'password')
			setPerson({ user_name: person['user_name'], password: value });
		else setPerson({ user_name: value, password: person['password'] });
	}

	function submitForm() {
		props.handleSubmit(person);
		setPerson({ user_name: '', password: '' });
	}
	return (
		<form>
			<label htmlFor="user_name">User_name</label>
			<input
				type="text"
				name="user_name"
				id="user_name"
				value={person.user_name}
				onChange={handleChange}
			/>
			<label htmlFor="password">Password</label>
			<input
				type="text"
				name="password"
				id="password"
				value={person.password}
				onChange={handleChange}
			/>
			<input type="button" value="Log in" onClick={submitForm} />
		</form>
	);
}
export default Form;
