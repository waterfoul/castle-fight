import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetch, start } from '../../reducers/room';
import { Seat } from './Seat';

import {isSeated} from '../../utils/isSeated';

/*
 The background of the game board
 G = Grass
 W = Water
 F = Forest
 R = Road
 A = Wall
 */
const board = [
	'GGGGGGGGGAGGGGGGGAWWWWWWWWWWWAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAWWWWWWWWWWWAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAWWWWWWWWWWWAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAWWWWWWWWWWWAGGGGGGGAGGGGGGGGG',
	'GGRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGG',
	'GGRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGG',
	'GGGGGGGGGAGGGGGGGAFFFFFFFFFFFAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAFFFFFFFFFFFAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAFFFFFFFFFFFAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAFFFFFFFFFFFAGGGGGGGAGGGGGGGGG',
	'GGRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGG',
	'GGRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGG',
	'GGGGGGGGGAGGGGGGGAWWWWWWWWWWWAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAWWWWWWWWWWWAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAWWWWWWWWWWWAGGGGGGGAGGGGGGGGG',
	'GGGGGGGGGAGGGGGGGAWWWWWWWWWWWAGGGGGGGAGGGGGGGGG',
];

class GameComponent extends Component {
	componentWillMount() {
		this.props.fetch(this.props.match.params.id);
	}

	render() {
		const userIsSeated = this.props.room && isSeated(this.props.user, this.props.room)

		return this.props.room && (
				<div id="game" className="container-fluid game-component">
					<div className="col-md-1">
						<Seat seat="Red1" userIsSeated={userIsSeated}/>
						<Seat seat="Red2" userIsSeated={userIsSeated}/>
						<Seat seat="Red3" userIsSeated={userIsSeated}/>
						<Seat seat="Red4" userIsSeated={userIsSeated}/>
					</div>
					<div className="col-md-10">
						<div className="game-board">
							{board.map((row, i) => {
								return row.split('').map((col, j) => {
									return <div className={`row${i} col${j} background ${col}`} ></div>;
								})
							})}
						</div>
					</div>
					<div className="col-md-1">
						<div className="pull-right">
							<Seat seat="Blue1" userIsSeated={userIsSeated}/>
							<Seat seat="Blue2" userIsSeated={userIsSeated}/>
							<Seat seat="Blue3" userIsSeated={userIsSeated}/>
							<Seat seat="Blue4" userIsSeated={userIsSeated}/>
						</div>
					</div>
					{!this.props.room.started ? (
						<button
							className="btn btn-primary col-md-offset-5 col-md-2"
							onClick={this.props.start}
						>
							Start!
						</button>
					) : ''}
				</div>
			);
	}
}

export const Game  = connect(
	({ room, user }) => ({ room, user }),
	{ fetch, start }
)(GameComponent);