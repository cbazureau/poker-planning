import React from "react";
import _get from "lodash/get";
import "./RoomSubmitter.css";
import PROFILES from "../utils/profiles";

const RoomSubmitter = ({ roomData, currentSocketId }) => {
  const user = _get(roomData, 'users', []).find(user => user.id === currentSocketId);
  if(!user || user.profile === PROFILES.VOTER) return null;
  return (
    <div className="RoomSubmitter">
      RoomSubmitter
    </div>
  );
};

export default RoomSubmitter;
