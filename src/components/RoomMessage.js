import React, { Fragment } from "react";
import _get from "lodash/get";
import "./RoomMessage.css";
import VOTES from "../utils/votes";
import PROFILES from "../utils/profiles";
import CARDS from "../utils/cards";

const Votes = ({ votes, withStoryPoint }) => (
  <Fragment>
    <div className="RoomMessage__votes has-voted">
      <div className="RoomMessage__voteTitle">
        {withStoryPoint ? "Have voted" : "Have already voted"}
      </div>
      {votes
        .filter((vote) => vote.storyPoint)
        .map(({ user, storyPoint }) => (
          <div className="RoomMessage__vote" key={user}>
            <span className="RoomMessage__user">{user}</span>
            {withStoryPoint && (
              <span className="RoomMessage__storypoint">{storyPoint}</span>
            )}
          </div>
        ))}
    </div>
    <div className="RoomMessage__votes">
      <div className="RoomMessage__voteTitle">
        {withStoryPoint ? "Didn't vote" : "Still needs to vote"}
      </div>
      {votes
        .filter((vote) => !vote.storyPoint)
        .map(({ user }) => (
          <span key={user} className="RoomMessage__user">
            {user}
          </span>
        ))}
    </div>
  </Fragment>
);

const Results = ({ votes }) => (
  <Fragment>
    <div className="RoomMessage__results">
      {CARDS.map((card) => (
        <div
          className="RoomMessage__resultsLine"
          style={{ backgroundColor: card.color }}
          key={card.score}
        >
          <div className="RoomMessage__resultsLineScore">{card.score}</div>
          <div className="RoomMessage__resultsLineVoters">
            {votes
              .filter((vote) => vote.storyPoint === card.score)
              .map(({ user }) => (
                <div className="RoomMessage__resultsLineVoter" key={user}>
                  {user}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
    <div className="RoomMessage__votes">
      <div className="RoomMessage__voteTitle">Didn't vote</div>
      {votes
        .filter((vote) => !vote.storyPoint)
        .map(({ user }) => (
          <span key={user} className="RoomMessage__user">
            {user}
          </span>
        ))}
    </div>
  </Fragment>
);

const RoomMessage = ({ roomData, currentSocketId, onReveal }) => {
  const currentVote = _get(roomData, "currentVote", {});
  const currentVoteStatus = currentVote.status || VOTES.NOT_STARTED;
  const user = _get(roomData, "users", []).find(
    (user) => user.id === currentSocketId
  );
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
        <div className="CardBox">
          <div className="CardBox__intro">Waiting for a new vote ...</div>
        </div>
      </div>
    );
  }
  if (currentVoteStatus === VOTES.PENDING) {
    return (
      <div className="RoomMessage">
        <div className="CardBox">
          <div className="CardBox__intro">Voting for {currentVote.id} ...</div>
          <Votes votes={votes} />
          {!!user &&
            (user.profile === PROFILES.SUBMITTER ||
              user.profile === PROFILES.BOTH) && (
              <button
                className="CardBox__button"
                type="submit"
                onClick={() => onReveal()}
              >
                Reveal
              </button>
            )}
        </div>
        }
      </div>
    );
  }
  return (
    <div className="RoomMessage">
      <div className="CardBox">
        <div className="CardBox__intro">
          Results for {currentVote.id} (Waiting for a new vote)
        </div>
        <Results votes={votes} />
      </div>
    </div>
  );
};

export default RoomMessage;
