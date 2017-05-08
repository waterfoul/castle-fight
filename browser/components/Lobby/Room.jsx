import React from 'react';
import { Link } from 'react-router-dom';

export const Room = ({ room, user, join }) => {
	return (
		<div>
			<div className="lobby-room">
				<div>{room.name}</div>
				<div className="container-fluid">
					<div className="col-md-5">
						<div>{room.Red1 ? room.Red1.name : '______'}</div>
						<div>{room.Red2 ? room.Red2.name : '______'}</div>
						<div>{room.Red3 ? room.Red3.name : '______'}</div>
						<div>{room.Red4 ? room.Red4.name : '______'}</div>
					</div>
					<div className="col-md-2">
						<br/>
						VS
					</div>
					<div className="col-md-5">
						<div>{room.Blue1 ? room.Blue1.name : '______'}</div>
						<div>{room.Blue2 ? room.Blue2.name : '______'}</div>
						<div>{room.Blue3 ? room.Blue3.name : '______'}</div>
						<div>{room.Blue4 ? room.Blue4.name : '______'}</div>
					</div>
				</div>
				<div className="btn-group">
					<Link
						to={`/game/${room.id}`}
						className="btn btn-primary"
					>
						View
					</Link>
				</div>
			</div>
		</div>
	);
};
