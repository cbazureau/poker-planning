import React from "react";
import classnames from "classnames";
import "./VoteButton.css";

/**
 * VoteButton
 */
const VoteButton = ({ storyPoint, activeStoryPoint, onVote }) => (
  <button
    className={classnames("VoteButton", {
      "is-active": storyPoint === activeStoryPoint,
    })}
    type="button"
    onClick={() => onVote({ storyPoint })}
  >
    {storyPoint}
  </button>
);

export default VoteButton;
