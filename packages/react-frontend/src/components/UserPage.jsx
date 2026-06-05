import { useState } from 'react';
import { loginUser, registerUser } from '../user';

function UserPage({ currentUser, onLogout, onSubmit }) {
	const [mode, setMode] = useState('login');
	const [form, setForm] = useState({
		email: '',
		password: '',
		username: '',
	});

	const handleChange = (event) => {
		setForm({
			...form,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (mode === 'login') {
			loginUser(form.email, form.password)
				.then((data) => {
					onSubmit({
						_id: data._id,
						email: form.email,
						username: data.name,
					});
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			registerUser(form.username, form.email, form.password)
				.then((data) => {
					onSubmit({
						email: form.email,
						username: form.username,
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	if (currentUser) {
		return (
			<main className="page-wrap">
				<section className="web-page account-page">
					<header className="page-header">
						<div>
							<p>Account</p>
							<h1>Welcome back, {currentUser.username}.</h1>
						</div>
						<div className="avatar">
							{currentUser.username.slice(0, 2).toUpperCase()}
						</div>
					</header>

					<div className="account-layout">
						<section className="account-card">
							<h2>Your reader profile</h2>
							<p>
								This is the username that will show up when you leave reviews,
								comments, and ratings.
							</p>
							<div className="profile-row">
								<span>Username</span>
								<strong>{currentUser.username}</strong>
							</div>
							<div className="profile-row">
								<span>Email</span>
								<strong>{currentUser.email || 'Not added yet'}</strong>
							</div>
							<button
								className="secondary-action"
								onClick={onLogout}
								type="button"
							>
								Log out
							</button>
						</section>

						<section className="account-card account-note">
							<h2>Next actions</h2>
							<p>
								Go to Reviews to write a public comment and rating as{' '}
								{currentUser.username}.
							</p>
						</section>
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className="page-wrap">
			<section className="web-page account-page">
				<header className="page-header">
					<div>
						<p>Account</p>
						<h1>
							{mode === 'login'
								? 'Log in to keep reading.'
								: 'Create your reader name.'}
						</h1>
					</div>
					<div className="avatar">BT</div>
				</header>

				<div className="auth-layout">
					<section className="auth-card">
						<div className="auth-switch">
							<button
								className={mode === 'login' ? 'active' : ''}
								onClick={() => setMode('login')}
								type="button"
							>
								Log in
							</button>
							<button
								className={mode === 'register' ? 'active' : ''}
								onClick={() => setMode('register')}
								type="button"
							>
								Register
							</button>
						</div>

						<form className="auth-form" onSubmit={handleSubmit}>
							{mode === 'register' && (
								<label>
									Username
									<input
										name="username"
										onChange={handleChange}
										placeholder="Your public reader name"
										value={form.username}
									/>
								</label>
							)}
							<label>
								Email
								<input
									name="email"
									onChange={handleChange}
									placeholder="reader@example.com"
									type="email"
									value={form.email}
								/>
							</label>
							<label>
								Password
								<input
									name="password"
									onChange={handleChange}
									placeholder="Password"
									type="password"
									value={form.password}
								/>
							</label>
							<button className="primary-action" type="submit">
								{mode === 'login' ? 'Log in' : 'Create account'}
							</button>
						</form>
					</section>

					<section className="auth-copy">
						<h2>One identity across your book club.</h2>
						<p>
							After logging in, your username appears beside reviews, comments,
							and ratings across the site.
						</p>
					</section>
				</div>
			</section>
		</main>
	);
}

export default UserPage;
