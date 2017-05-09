// @flow
'use strict';

const webpack = require('webpack');
const devMode = process.env.NODE_ENV === 'development';
const disableBrowser = process.env.NODE_DISABLE === 'browser';
const disableServer = process.env.NODE_DISABLE === 'server';
const nodeExternals = require('webpack-node-externals');
const path = require('path');

/**
 * Fast source maps rebuild quickly during development, but only give a link
 * to the line where the error occurred. The stack trace will show the bundled
 * code, not the original code. Keep this on `false` for slower builds but
 * usable stack traces. Set to `true` if you want to speed up development.
 */

const USE_FAST_SOURCE_MAPS = false;

const baseConfig = {
	context: __dirname,
	devtool: devMode && USE_FAST_SOURCE_MAPS ?
		'cheap-module-eval-source-map' :
		'source-map',
	resolve: {
		extensions: ['.js', '/index.js', '.jsx', '/index.jsx', '.json', '*']
	},
	module: {
		rules: [{
			test: /jsx?$/,
			exclude: /(node_modules|bower_components)/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['react', 'es2015', 'stage-2']
				}
			}]
		}]
	},
	plugins: devMode ? [
		{
			apply: (compiler) => {
				compiler.plugin('compilation', function() {
					// This is just a utility, not part of the server
					// eslint-disable-next-line no-console
					console.log(new Date(), 'Build Started!');
				});
			}
		}
	] : []
};

module.exports = [
	Object.assign({}, baseConfig, {
		entry: {
			'bundle.js': path.resolve(__dirname, 'browser', 'index.jsx')
		},
		output: {
			path: path.join(__dirname, '/browser/static/'),
			publicPath: '/static',
			filename: '[name]'
		},
		devServer: {
			proxy: {
				'/': {
					target: 'http://localhost:1338',
					secure: false,
					bypass: function(req, res, proxyOptions) {
						if (req.originalUrl === '/static/bundle.js') {
							console.log('Skipping proxy for bundle request.');
							return '/static/bundle.js';
						}
					}
				}
			},
			port: 1337
		}
	}),
	disableServer ? {} : Object.assign({}, baseConfig, {
		entry: {
			'index.js': path.resolve(__dirname, 'server', 'index.js'),
			'seed.js': path.resolve(__dirname, 'server', 'db', 'seed.js')
		},
		target: "node",
		externals: [nodeExternals()],
		node: {
			__filename: true,
			__dirname: true
		},
		output: {
			path: __dirname,
			filename: '[name]'
		},
		plugins: baseConfig.plugins.concat([
			new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
		])
	})
];

if(disableBrowser) {
	module.exports = module.exports[1];
} else if(disableServer) {
	module.exports = module.exports[0];
}
