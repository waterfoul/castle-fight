import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetch, start } from '../../reducers/room';
import { setPosition, finishBuild } from '../../reducers/build';
import { Seat } from './Seat';

import { isSeated } from '../../utils/isSeated';

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
		this.timeout = null;
	}

	backgroundOver(row, col, type) {
		if (this.props.build && this.props.build.type && type === 'G') {
			// TODO: Make sure the building is on the right side
			clearTimeout(this.timeout);
			this.props.setPosition(row, col);
		}
	}
	backgroundOut() {
		if (this.props.build && this.props.build.type) {
			this.timeout = setTimeout(() => {
				this.props.setPosition('', '');
			}, 10)
		}
	}
	backgroundClick(row, col, type) {
		console.log('click', row, col, type);
		if (this.props.build && this.props.build.type) {

		}
	}

	render() {
		const userIsSeated = this.props.room && isSeated(this.props.user, this.props.room);

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
									return <div
										key={`${i}x${j}`}
										className={`row${i} col${j} background ${col}`}
										onMouseOver={() => this.backgroundOver(i, j, col)}
										onMouseOut={() => this.backgroundOut(i, j, col)}
										onClick={() => this.backgroundClick(i, j, col)}
									/>;
								})
							})}
							<div
								className={`building build ${this.props.build.type} row${this.props.build.row} col${this.props.build.col}`}
								onMouseOver={() => clearTimeout(this.timeout)}
								onMouseOut={() => this.backgroundOut()}
								onClick={this.props.finishBuild}
							/>
							{this.props.room && this.props.room.gameState && this.props.room.gameState.buildings && this.props.room.gameState.buildings.map((building, i) => (
								<div
									key={i}
									className={`row${building.row} col${building.col} building ${building.type} ${building.seat}`}
								/>
							))}
							{this.props.room && this.props.room.gameState && this.props.room.gameState.units && this.props.room.gameState.units.map((unit, i) => (
								<div
									key={i}
									className={`row${unit.row} col${unit.col} unit ${unit.type} ${unit.seat}`}
								/>
							))}
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
	({ room, user, build }) => ({ room, user, build }),
	{ fetch, start, setPosition, finishBuild }
)(GameComponent);