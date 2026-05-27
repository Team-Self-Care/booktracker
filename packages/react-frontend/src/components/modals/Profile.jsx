import '../../style/css/index.css';

function Profile(props) {
	const abbrev = props.user
		.split(' ')
		.map((name) => name.charAt(0).toUpperCase())
		.join('');

	return (
		<div className="profile">
			<div className="centered">
				<div className="icon">
					<h1>{abbrev}</h1>
				</div>
			</div>

			<div className="details">
				<p className="username">{props.user}</p>
				<p className="stats">
					{props.reviews} public reviews . {props.average} avg
				</p>
				<button className="button" type="button">
					+ Add User
				</button>
			</div>
		</div>
	);
}

export default Profile;
