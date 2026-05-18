import { useState } from 'react';
import '../style/css/index.css';

function Navbar() {
	return (
		<nav className="navbar">
			<header>booktracker</header>

			<section class="tabs">
				<a>Home</a>
				<a>Search</a>
				<a>Lists</a>
				<a>Reviews</a>
			</section>

			<div class="account">
				<a>Account</a>
			</div>
		</nav>
	);
}

export default Navbar;
