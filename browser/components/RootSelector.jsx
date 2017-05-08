import React from 'react';
import { connect } from 'react-redux';

import { Lobby } from './Lobby';
import { Login } from './Login';

export const RootSelector = connect(
	({ user }) => ({ user })
)(
	({ user }) => (
		user ? (<Lobby />) : (<Login />)
	)
);
