import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import store from "../store";
import io from "socket.io-client";
import useBeforeUnload from '../utils/useBeforeUnload';
import './Room.css';

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
  const socketDomain = window.location.host === 'localhost:3000' ? 'localhost:5000' : window.location.host;
  const protocol = window.location.host.indexOf('localhost') > -1 ? 'http' : 'https';
  const socket = useRef(io(`${protocol}://${socketDomain}`));
  socket.current.on('connect', () => {
    setSocketStatus(STATUS.CONNECTED)
  });
  socket.current.on('update', ({you, data}) => {
    updateRoom({you, data});
  });
  const roomId = match.params.room;

  useBeforeUnload(() => {
    if(socketStatus === STATUS.IN_ROOM) socket.current.emit('leave');
  })

  useEffect(() => {
    if(socketStatus === STATUS.CONNECTED) socket.current.emit('find', roomId);
  }, [socketStatus, roomId])

  return (
    <div className="Room">
      Room {roomId} {currentSocketId} {socketStatus} {JSON.stringify(roomData)}
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
