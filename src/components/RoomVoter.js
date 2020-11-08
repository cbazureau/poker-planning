import React from 'react';
import _get from 'lodash/get';
import VoteButton from './VoteButton';
import './RoomVoter.css';
import PROFILES from '../utils/profiles';
import VOTES from '../utils/votes';

/**
 * RoomVoter
 */
const RoomVoter = ({ roomData, currentSocketId, onVote }) => {
	const cards = [ '0', '1', '2', '3', '5', '8', '13', '20', '?' ];
	const user = _get(roomData, 'users', []).find((user) => user.id === currentSocketId);
	if (!user || (user.profile !== PROFILES.VOTER && user.profile !== PROFILES.BOTH)) return null;
	const currentVote = _get(roomData, 'currentVote');
	// Currently not voting or is already revealed
	if (!currentVote || currentVote.status !== VOTES.PENDING) return null;

	const activeStoryPoint = (_get(currentVote, 'voters', []).find((user) => user.id === currentSocketId) || {}).vote;

	return (
		<div className="RoomVoter">
			<div className="CardBox">
				<div className="CardBox__intro">Please choose a card below.</div>
				<div className="RoomVoter_cards">
					{cards.map((card) => (
						<VoteButton key={card} onVote={onVote} storyPoint={card} activeStoryPoint={activeStoryPoint} />
					))}
				</div>
			</div>
		</div>
	);
};

export default RoomVoter;
