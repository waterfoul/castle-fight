import passport from 'passport';
import args from '../utils/args';
import { logger } from '../utils/logger';

import User from '../db/models/user';
import OAuth from '../db/models/oauth';
import express from 'express';
import uuid from 'uuid/v4';

export const auth = new express.Router();

export const authKeys = {};

OAuth.setupStrategy({
	provider: 'facebook',
	Strategy: require('passport-facebook').Strategy,
	config: {
		clientID: args.facebookClientId,
		clientSecret: args.facebookClientSecret,
		callbackURL: `${args.baseUrl}/api/auth/login/facebook`,
		profileFields: ['displayName', 'email'],
		scope: ['email']
	},
	passport
});

OAuth.setupStrategy({
	provider: 'google',
	Strategy: require('passport-google-oauth').OAuth2Strategy,
	config: {
		clientID: args.googleClientId,
		clientSecret: args.googleClientSecret,
		callbackURL: `${args.baseUrl}/api/auth/login/google`,
		scope: ['email']
	},
	passport
});

OAuth.setupStrategy({
	provider: 'github',
	Strategy: require('passport-github2').Strategy,
	config: {
		clientID: args.githubClientId,
		clientSecret: args.githubClientSecret,
		callbackURL: `${args.baseUrl}/api/auth/login/github`,
		scope: ['user:email']
	},
	passport
});

// Other passport configuration:
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(
	(id, done) => {
		logger.info('will deserialize user.id=%d', id);
		User.findById(id)
			.then((user) => {
				if (!user) logger.info('deserialize retrieved null user for id=%d', id);
				else logger.info('deserialize did ok user.id=%d', id);
				done(null, user);
			})
			.catch((err) => {
				logger.info('deserialize did fail err=%s', err);
				done(err);
			});
	}
);

auth.get('/whoami', (req, res) => {
	const key = uuid();
	authKeys[key] = req.user;
	setTimeout(() => {
		delete authKeys[key];
	}, 10000);

	res.send({
		...req.user.toJSON(),
		authKey: key
	})
});

// GET requests for OAuth login:
// Register this route as a callback URL with OAuth provider
auth.get('/login/:strategy', (req, res, next) =>
	passport.authenticate(req.params.strategy, {
		successRedirect: '/'
	})(req, res, next)
);

auth.post('/logout', (req, res, next) => {
	req.logout();
	res.redirect('/api/auth/whoami');
});
