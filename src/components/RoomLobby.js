import React, { useState } from 'react';
import classnames from 'classnames';
import './RoomLobby.css';
import PROFILES from '../utils/profiles';

const RoomLobby = ({ onSubmit }) => {
	const [ user, setUser ] = useState(undefined);
	const [ profile, setProfile ] = useState(undefined);
	return (
		<div className="RoomLobby">
			<div className="CardBox">
				<div className="RoomLobby__group">
					<div className="RoomLobby__intro">
						Choose a username. Choose wisely, as it can't be changed later.
					</div>
					<label className="RoomLobby__label" htmlFor="user">
						Username
					</label>
					<input
						className="RoomLobby__input"
						type="text"
						id="user"
						name="user"
						placeholder="Anne Onymous"
						onChange={(event) => setUser(event.target.value)}
					/>
				</div>
				<div className="RoomLobby__group">
					<label className="RoomLobby__label" htmlFor="profile">
						Role
					</label>
					<div className="RoomLobby__radios">
						<label className="RoomLobby__radioLabel">
							<input
								className="RoomLobby__radio"
								type="radio"
								checked={PROFILES.SUBMITTER === profile}
								onClick={() => setProfile(PROFILES.SUBMITTER)}
							/>
							<span>Product Owner - I'm here to submit stories</span>
						</label>
						<label className="RoomLobby__radioLabel">
							<input
								className="RoomLobby__radio"
								type="radio"
								checked={PROFILES.VOTER === profile}
								onClick={() => setProfile(PROFILES.VOTER)}
							/>
							<span>Developper - I'm here to estimate stories</span>
						</label>
						<label className="RoomLobby__radioLabel">
							<input
								className="RoomLobby__radio"
								type="radio"
								checked={PROFILES.BOTH === profile}
								onClick={() => setProfile(PROFILES.BOTH)}
							/>
							<span>I want to do both !</span>
						</label>
					</div>
				</div>
				<button className="CardBox__button" type="submit" onClick={() => onSubmit({ user, profile })}>
					Let's groom !
				</button>
			</div>
		</div>
	);
};
export default RoomLobby;
