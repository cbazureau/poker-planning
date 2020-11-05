import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const DEFAULT_ROOM = String(new Date() - new Date().setHours(0, 0, 0, 0));

const Home = () => {
	return (
		<div className="Home">
			<div>
				<h1>Poker Planning</h1>
				<Link className="primary-button" to={'/r/' + DEFAULT_ROOM}>
          Create Room
				</Link>
			</div>
		</div>
	);
};
export default Home;
