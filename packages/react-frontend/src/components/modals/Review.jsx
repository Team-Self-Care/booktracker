import { useState } from 'react';
import '../../style/css/index.css';

function Review(props) {
	return (
		<div className="review">
            <h1 className="title">{props.title}</h1>
            <p className="content">{props.review}</p>
            <footer className="details">
                <p>{props.comments} comments • {props.rating} rating</p>
                <a className="button">Comment</a>
            </footer>
        </div>
	);
}

export default Review;
