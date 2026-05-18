import { useState } from 'react';
import '../../style/css/index.css';

function Profile(props) {
	const abbrev = [];
	const split = props.user.split(' ');

	for (let i = 0; i < split.length; i++) {
		abbrev.push(split[i].charAt(0).toUpperCase());
	}
	abbrev.join('');

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
					{props.reviews} public reviews • {props.average} avg
				</p>
				<a className="button">+ Add User</a>
			</div>
		</div>
	);
}

export default Profile;
