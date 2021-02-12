import React from "react";
import classnames from "classnames";
import "./VoteButton.css";

/**
 * VoteButton
 */
const VoteButton = ({ card, activeStoryPoint, onVote }) => (
  <button
    className={classnames("VoteButton", {
      "is-active": card.score === activeStoryPoint,
    })}
    type="button"
    onClick={() => onVote({ storyPoint: card.score })}
    style={{ borderColor: card.color }}
  >
    <span className="VoteButton__inner" style={{ backgroundColor: card.color }}>
      <span className="VoteButton__mark">{card.score}</span>
    </span>
  </button>
);

export default VoteButton;
