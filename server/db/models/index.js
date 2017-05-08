
'use strict';

const User = require('./user');
const OAuth = require('./oauth');
const Room = require('./room');

OAuth.belongsTo(User);
User.hasOne(OAuth);

Room.belongsTo(User, { as: 'Red1' });
Room.belongsTo(User, { as: 'Red2' });
Room.belongsTo(User, { as: 'Red3' });
Room.belongsTo(User, { as: 'Red4' });

Room.belongsTo(User, { as: 'Blue1' });
Room.belongsTo(User, { as: 'Blue2' });
Room.belongsTo(User, { as: 'Blue3' });
Room.belongsTo(User, { as: 'Blue4' });
