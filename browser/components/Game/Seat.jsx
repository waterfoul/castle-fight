import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sit } from '../../reducers/room';

const TakeSeat = connect(
	({}) => ({}),
	(dispatch, {seat}) => ({sit: () => dispatch(sit(seat))})
)(({sit, userIsSeated}) => {
	return (
		<div className="btn-group">
			{userIsSeated ? '' : (<button className="btn btn-primary" onClick={sit}>Sit</button>)}
			<button className={userIsSeated ? 'btn btn-primary' : 'btn btn-info'}>Assign Bot</button>
		</div>
	)
});

export const Seat = connect(
	({ room }) => ({ room }),
	{ }
)(({room, seat, userIsSeated}) => {
	return (
		<div>
			{room[seat] ? room[seat].name : (room.started ? '' : <TakeSeat seat={seat} userIsSeated={userIsSeated}/>)}
		</div>
	);
});