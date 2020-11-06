import React from "react";
import _get from "lodash/get";
import "./RoomMain.css";
import PROFILES from "../utils/profiles";

const RoomMain = ({ roomData, currentSocketId }) => {
  return (
    <div className="RoomMain">
      RoomMain
      <pre>{JSON.stringify(roomData, null, 2)}</pre>
    </div>
  );
};

export default RoomMain;
