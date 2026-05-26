import '../../style/css/index.css';

function Review(props) {
	return (
		<div className="review">
			<h1 className="title">{props.title}</h1>
			<p className="content">{props.review}</p>
			<footer className="details">
				<p>
					{props.comments} comments . {props.rating} rating
				</p>
				<button className="button" type="button">
					Comment
				</button>
			</footer>
		</div>
	);
}

export default Review;
