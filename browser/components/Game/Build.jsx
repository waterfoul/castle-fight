// @flow

import React from 'react';
import { connect } from 'react-redux';

import { startBuild } from '../../reducers/build';

const buildings = ['space1'];

export const Build = connect(
	null,
	{startBuild}
)(({startBuild}) => {
	return (
		<div className="btn-group">
			{ buildings.map((v) => <img key={v} src={`/static/buildings/${v}/building.png`} onClick={() => startBuild(v)} />)}
		</div>
	)
});