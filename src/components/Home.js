import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const DEFAULT_ROOM = String(new Date() - new Date().setHours(0, 0, 0, 0));

const Home = () => {
	return (
		<div className="Home">
			<div className="Home__card">
				<h1 className="Home__title">Grooming</h1>
				<Link className="Home__start" to={'/r/' + DEFAULT_ROOM}>
					Let's groom !
				</Link>
			</div>
		</div>
	);
};
export default Home;
