import React from "react";
import _get from "lodash/get";
import "./RoomVoter.css";
import PROFILES from "../utils/profiles";

const RoomVoter = ({ roomData, currentSocketId }) => {
  const user = _get(roomData, 'users', []).find(user => user.id === currentSocketId);
  if(!user || user.profile === PROFILES.VOTER) return null;
  return (
    <div className="RoomVoter">
      RoomVoter
    </div>
  );
};

export default RoomVoter;
