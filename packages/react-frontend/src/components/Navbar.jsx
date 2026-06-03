import '../style/css/index.css';
import logo from './logo.png';
const visibleTabs = ['Home', 'Search', 'List', 'Reviews'];

function Navbar({ activePage, currentUser, onNavigate }) {
	return (
		<nav className="navbar">
			<img src={logo} className="Nav_logo" alt="logo" />

			<section className="tabs">
				{visibleTabs.map((tab) => (
					<button
						className={activePage === tab ? 'active' : ''}
						key={tab}
						onClick={() => onNavigate(tab)}
						type="button"
					>
						{tab}
					</button>
				))}
			</section>

			<div className="account">
				<button
					className={activePage === 'Account' ? 'active' : ''}
					onClick={() => onNavigate('Account')}
					type="button"
				>
					{currentUser ? currentUser.username : 'Account'}
				</button>
			</div>
		</nav>
	);
}

export default Navbar;
