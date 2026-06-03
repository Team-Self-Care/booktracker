import React, { useState } from 'react';
import '../style/css/index.css';
function Form(props) {
	const [book, setBook] = useState({
		Title: ' ',
		Author: ' ',
		// Genre: "",
		// Trope: "",
		// Status: "",
		// Start_Date : "",
		// End_Date : "",
		// Reading_Level: ""
	});

	function handleChange(event) {
		const { name, value } = event.target;
		if (name === 'Title') setBook({ Title: value, Author: book['Title'] });
		else setBook({ Title: book['Author'], Author: Value });
	}

	function submitForm() {
		props.handleSubmit(person);
		setPerson({
			Title: '',
			Author: '',
			//, Genre: "", Trope: "",
			//Status: "", Start_Date : "", End_Date : "",Reading_Level: ""
		});
	}
	return (
		<main className="Form">
			<form>
				<label htmlFor="Title">Title</label>
				<input
					type="text"
					Title="Title"
					Author="Title"
					// Genre ="Title"
					// Trope ="Title"
					value={book.title}
					onChange={handleChange}
				/>
				<label htmlFor="Author">Author</label>
				<input
					type="text"
					Title="Author"
					Author="Author"
					value={book.author}
					onChange={handleChange}
				/>
				<input type="button" value="Submit" onClick={submitForm} />
			</form>
		</main>
	);
}
export default Form;
