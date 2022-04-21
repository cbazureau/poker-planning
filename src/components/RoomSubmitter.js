import React, { useState } from 'react';
import _get from 'lodash/get';
import './RoomSubmitter.css';
import PROFILES from '../utils/profiles';
import VOTES from '../utils/votes';

const RoomSubmitter = ({
  roomData,
  currentSocketId,
  onReveal,
  onProposeVote,
}) => {
  const [voteId, setVoteId] = useState(undefined);
  const [link, setLink] = useState();
  const user = _get(roomData, 'users', []).find(
    (user) => user.id === currentSocketId
  );
  const currentVote = _get(roomData, 'currentVote');

  // Not authorized
  if (
    !user ||
    (user.profile !== PROFILES.SUBMITTER && user.profile !== PROFILES.BOTH)
  )
    return null;

  // Currently not voting or is already revealed
  if (!currentVote || currentVote.status === VOTES.REVEAL)
    return (
      <div className="RoomSubmitter">
        <div className="CardBox">
          <div className="CardBox__intro">
            Enter the JIRA ticket id that you want to groom.
          </div>
          <div className="CardBox__group">
            <label className="CardBox__label" htmlFor="voteId">
              JIRA ID
            </label>
            <input
              className="CardBox__input"
              type="text"
              id="voteId"
              name="voteId"
              placeholder="ONE-1234"
              onChange={(event) => setVoteId(event.target.value)}
            />
            <label className="CardBox__label" htmlFor="link">
              Link to US
            </label>
            <input
              className="CardBox__input"
              type="text"
              id="link"
              name="link"
              placeholder="https://jira.dt.renault.com/browse/<User Story ID>"
              onChange={(event) => setLink(event.target.value)}
            />
          </div>
          <button
            className="CardBox__button"
            type="submit"
            onClick={() => onProposeVote({ voteId, link })}
          >
            Let's vote !
          </button>
        </div>
      </div>
    );

  // Voting in progress (Reveal is on RoomMessage)
  return null;
};

export default RoomSubmitter;
