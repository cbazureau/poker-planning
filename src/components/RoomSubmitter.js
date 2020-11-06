import React, { useState } from "react";
import _get from "lodash/get";
import "./RoomSubmitter.css";
import PROFILES from "../utils/profiles";

const RoomSubmitter = ({
  roomData,
  currentSocketId,
  onReveal,
  onProposeVote,
}) => {
  const [voteId, setVoteId] = useState(undefined);
  const user = _get(roomData, "users", []).find(
    (user) => user.id === currentSocketId
  );
  const currentVote = _get(roomData, "currentVote");

  // Not authorized
  if (!user || user.profile === PROFILES.VOTER) return null;

  // Currently not voting or is already revealed
  if (!currentVote || currentVote.status === "REVEAL")
    return (
      <div className="RoomSubmitter">
        <div className="RoomLobby__group">
          <label className="RoomLobby__label" htmlFor="voteId">
            JIRA ID
          </label>
          <input
            className="RoomLobby__input"
            type="text"
            id="voteId"
            name="voteId"
            placeholder="ONE-1234"
            onChange={(event) => setVoteId(event.target.value)}
          />
        </div>
        <button
          className="RoomLobby__button RoomLobby__submit"
          type="submit"
          onClick={() => onProposeVote({ voteId })}
        >
          Let's vote !
        </button>
      </div>
    );

  // Voting in progress
  return (
    <div className="RoomSubmitter">
      <button
        className="RoomLobby__button RoomLobby__submit"
        type="submit"
        onClick={() => onReveal()}
      >
        Reveal
      </button>
    </div>
  );
};

export default RoomSubmitter;
