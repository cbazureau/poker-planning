import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import store from "../store";
import io from "socket.io-client";
import useBeforeUnload from "../utils/useBeforeUnload";
import "./Room.css";
import RoomLobby from "./RoomLobby";
import RoomSubmitter from "./RoomSubmitter";
import RoomMain from "./RoomMain";
import RoomVoter from "./RoomVoter";

const STATUS = {
  DISCONNECTED: "DISCONNECTED",
  IN_LOBBY: "IN_LOBBY",
  IN_ROOM: "IN_ROOM",
};

/**
 * Room
 * Create or access to a room
 */
const Room = ({ updateRoom, match, roomData, currentSocketId }) => {
  const [socketStatus, setSocketStatus] = useState(STATUS.DISCONNECTED);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentProfile, setCurrentProfile] = useState(undefined);
  const socketDomain =
    window.location.host === "localhost:3000"
      ? "localhost:5000"
      : window.location.host;
  const protocol =
    window.location.host.indexOf("localhost") > -1 ? "http" : "https";
  const socket = useRef(io(`${protocol}://${socketDomain}`));

  const onFormSubmit = ({ user, profile }) => {
    setCurrentUser(user);
    setCurrentProfile(profile);
  };

  const onProposeVote = ({ voteId }) => {
    socket.current.emit("propose-vote", { voteId });
  };

  const onReveal = () => {
    socket.current.emit("reveal-vote");
  };

  socket.current.on("connect", () => {
    setSocketStatus(STATUS.IN_LOBBY);
  });
  socket.current.on("update", ({ you, data }) => {
    updateRoom({ you, data });
    if (socketStatus === STATUS.IN_LOBBY) {
      setSocketStatus(STATUS.IN_ROOM);
    }
  });
  const roomId = match.params.room;

  useBeforeUnload(() => {
    if (socketStatus === STATUS.IN_ROOM) {
      socket.current.emit("leave");
    }
  });

  useEffect(() => {
    if (socketStatus === STATUS.IN_LOBBY && !!currentProfile && !!currentUser) {
      socket.current.emit("find", {
        roomId,
        user: currentUser,
        profile: currentProfile,
      });
    }
  }, [socketStatus, roomId, currentUser, currentProfile]);

  return (
    <div className="Room">
      {socketStatus === STATUS.IN_LOBBY && (
        <RoomLobby onSubmit={onFormSubmit} />
      )}
      {socketStatus === STATUS.IN_ROOM && (
        <div className="Room__zones">
          <RoomMain currentSocketId={currentSocketId} roomData={roomData} />
          <RoomSubmitter
            currentSocketId={currentSocketId}
            roomData={roomData}
            onProposeVote={onProposeVote}
            onReveal={onReveal}
          />
          <RoomVoter currentSocketId={currentSocketId} roomData={roomData} />
        </div>
      )}
      <div className="Room__info">
        Room {roomId} {currentSocketId} {socketStatus}
      </div>
    </div>
  );
};

const mapStateToProps = ({ room: { data, you } }) => ({
  roomData: data,
  currentSocketId: you,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateRoom: ({ you, data }) =>
    store.dispatch({ type: "UPDATE_ROOM", payload: { you, data } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
