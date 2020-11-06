import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import store from "../store";
import io from "socket.io-client";
import useBeforeUnload from '../utils/useBeforeUnload';
import './Room.css';
import RoomForm from "./RoomForm";

const STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTED: 'connected',
  IN_ROOM: 'inroom',
}

/**
 * Room
 * Create or access to a room
 */
const Room = ({
  updateRoom,
  match,
  roomData,
  currentSocketId,
}) => {
  const [socketStatus, setSocketStatus] = useState(STATUS.DISCONNECTED)
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentProfile, setCurrentProfile] = useState(undefined);
  const socketDomain = window.location.host === 'localhost:3000' ? 'localhost:5000' : window.location.host;
  const protocol = window.location.host.indexOf('localhost') > -1 ? 'http' : 'https';
  const socket = useRef(io(`${protocol}://${socketDomain}`));

  const onFormSubmit = ({ user, profile }) => {
    setCurrentUser(user)
    setCurrentProfile(profile)
  };

  socket.current.on('connect', () => {
    setSocketStatus(STATUS.CONNECTED)
  });
  socket.current.on('update', ({you, data}) => {
    updateRoom({you, data});
    if(socketStatus === STATUS.CONNECTED) {
      setSocketStatus(STATUS.IN_ROOM)
    }
  });
  const roomId = match.params.room;

  useBeforeUnload(() => {
    if(socketStatus === STATUS.IN_ROOM) {
      socket.current.emit('leave');
    }
  })

  useEffect(() => {
    if(socketStatus === STATUS.CONNECTED && !!currentProfile && !!currentUser) {
      socket.current.emit('find', { roomId, user: currentUser, profile: currentProfile});
    }
  }, [socketStatus, roomId, currentUser, currentProfile])

  return (
    <div className="Room">
      {socketStatus === STATUS.CONNECTED && <RoomForm onSubmit={onFormSubmit} />}
      <div className="Room__info">
        Room {roomId} {currentSocketId} {socketStatus} {JSON.stringify(roomData)}
      </div>
    </div>
  );
};

const mapStateToProps = ({
  room: { data, you },
}) => ({ roomData: data, currentSocketId: you });

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateRoom: ({you, data}) => store.dispatch({ type: "UPDATE_ROOM", payload: { you, data } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
