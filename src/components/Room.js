import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';
import store from '../store';
import io from 'socket.io-client';
import useBeforeUnload from '../utils/useBeforeUnload';
import './Room.css';
import RoomLobby from './RoomLobby';
import RoomSubmitter from './RoomSubmitter';
import RoomMessage from './RoomMessage';
import RoomVoter from './RoomVoter';

const STATUS = {
	DISCONNECTED: 'DISCONNECTED',
	IN_LOBBY: 'IN_LOBBY',
	IN_ROOM: 'IN_ROOM'
};

/**
 * Room
 * Create or access to a room
 */
const Room = ({ updateRoom, match, roomData, currentSocketId }) => {
	const [ socketStatus, setSocketStatus ] = useState(STATUS.DISCONNECTED);
	const [ isQrcodeVisible, setQrcodeVisible ] = useState(false);
	const [ currentUser, setCurrentUser ] = useState(undefined);
	const [ currentProfile, setCurrentProfile ] = useState(undefined);
	const socketDomain = window.location.host === 'localhost:3000' ? 'localhost:5000' : window.location.host;
	const protocol = window.location.host.indexOf('localhost') > -1 ? 'http' : 'https';
	const socket = useRef(io(`${protocol}://${socketDomain}`));

	const onFormSubmit = ({ user, profile }) => {
		setCurrentUser(user);
		setCurrentProfile(profile);
	};

	const onVote = ({ storyPoint }) => {
		socket.current.emit('vote', { storyPoint });
	};

	const onProposeVote = ({ voteId }) => {
		socket.current.emit('propose-vote', { voteId });
	};

	const onReveal = () => {
		socket.current.emit('reveal-vote');
	};

	socket.current.on('connect', () => {
		setSocketStatus(STATUS.IN_LOBBY);
	});
	socket.current.on('update', ({ you, data }) => {
		// console.log('[update]', you, data);
		updateRoom({ you, data });
		if (socketStatus === STATUS.IN_LOBBY) {
			setSocketStatus(STATUS.IN_ROOM);
		}
	});
	const roomId = match.params.room;

	useBeforeUnload(() => {
		if (socketStatus === STATUS.IN_ROOM) {
			socket.current.emit('leave');
		}
	});

	useEffect(
		() => {
			if (socketStatus === STATUS.IN_LOBBY && !!currentProfile && !!currentUser) {
				socket.current.emit('find', {
					roomId,
					user: currentUser,
					profile: currentProfile
				});
			}
		},
		[ socketStatus, roomId, currentUser, currentProfile ]
	);

	return (
		<div className="Room">
			{isQrcodeVisible && (
				<div className="Room__QRCodeBox" onClick={() => setQrcodeVisible(false)}>
					<QRCode className="Room__QRCode" size="200" value={window.location.href} />
				</div>
			)}
			{socketStatus === STATUS.IN_LOBBY && <RoomLobby onSubmit={onFormSubmit} />}
			{socketStatus === STATUS.IN_ROOM && (
				<div className="Room__zones">
					<RoomMessage currentSocketId={currentSocketId} roomData={roomData} />
					<RoomSubmitter
						currentSocketId={currentSocketId}
						roomData={roomData}
						onProposeVote={onProposeVote}
						onReveal={onReveal}
					/>
					<RoomVoter currentSocketId={currentSocketId} roomData={roomData} onVote={onVote} />
				</div>
			)}
			<div className="Room__info">
				<span>
					Room {roomId} ({socketStatus}) -{' '}
				</span>
				{isQrcodeVisible && (
					<button className="Room__infobutton" onClick={() => setQrcodeVisible(false)}>
						hide QrCode
					</button>
				)}
				{!isQrcodeVisible && (
					<button className="Room__infobutton" onClick={() => setQrcodeVisible(true)}>
						view QrCode
					</button>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = ({ room: { data, you } }) => ({
	roomData: data,
	currentSocketId: you
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	updateRoom: ({ you, data }) => store.dispatch({ type: 'UPDATE_ROOM', payload: { you, data } })
});

export default connect(mapStateToProps, mapDispatchToProps)(Room);
