import React, { Fragment } from "react";
import _get from "lodash/get";
import "./RoomMessage.css";
import VOTES from "../utils/votes";
import PROFILES from "../utils/profiles";

const Votes = ({ votes, withStoryPoint }) => (
  <Fragment>
    <div className="RoomMessage__vote has-voted">
      {votes
        .filter((vote) => vote.storyPoint)
        .map(({ user, storyPoint }) => (
          <Fragment>
            <span className="RoomMessage__user">{user}</span>
            {withStoryPoint && (
              <span className="RoomMessage__storypoint">{storyPoint}</span>
            )}
          </Fragment>
        ))}
    </div>
    <div className="RoomMessage__vote">
      {votes
        .filter((vote) => !vote.storyPoint)
        .map(({ user }) => (
          <span className="RoomMessage__user">{user}</span>
        ))}
    </div>
  </Fragment>
);

const RoomMessage = ({ roomData, currentSocketId }) => {
  const currentVote = _get(roomData, "currentVote", {});
  const currentVoteStatus = currentVote.status || VOTES.NOT_STARTED;
  const votes = _get(roomData, "users", [])
    .filter(
      (user) =>
        user.profile === PROFILES.VOTER || user.profile === PROFILES.BOTH
    )
    .map((user) => {
      const voter =
        _get(roomData, "currentVote.voters", []).find(
          (voter) => user.id === voter.id
        ) || {};
      return {
        user: user.user,
        storyPoint: voter.vote || null,
      };
    });
  if (currentVoteStatus === VOTES.NOT_STARTED) {
    return (
      <div className="RoomMessage">
        <div className="RoomMessage__text">Waiting for a new vote ...</div>
      </div>
    );
  }
  if (currentVoteStatus === VOTES.PENDING) {
    return (
      <div className="RoomMessage">
        <div className="RoomMessage__text">Voting ...</div>
        <Votes votes={votes} />
      </div>
    );
  }
  return (
    <div className="RoomMessage">
      <div className="RoomMessage__text">Results (Waiting for a new vote)</div>
      <Votes votes={votes} withStoryPoint />
    </div>
  );
};

export default RoomMessage;
