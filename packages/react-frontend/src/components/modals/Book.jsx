import { useState } from 'react';
import '../../style/css/index.css';

function Book(props) {
	const tagButtons = [];

	for (let i = 0; i < props.genres.length; i++) {
		tagButtons.push(<a className="button">{props.genres[i]}</a>);
	}
	return (
		<div className="book">
			<div className="cover" />

			<div className="details">
				<h1 className="title">{props.title}</h1>
				<p className="content">
					{props.author} • {props.tag}
				</p>
				<footer className="genres">{tagButtons}</footer>
			</div>
		</div>
	);
}

export default Book;
