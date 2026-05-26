import '../../style/css/index.css';

function Book(props) {
	return (
		<div className="book">
			<div className="cover" />

			<div className="details">
				<h1 className="title">{props.title}</h1>
				<p className="content">
					{props.author} . {props.tag}
				</p>
				<footer className="genres">
					{props.genres.map((genre) => (
						<span className="button" key={genre}>
							{genre}
						</span>
					))}
				</footer>
			</div>
		</div>
	);
}

export default Book;
