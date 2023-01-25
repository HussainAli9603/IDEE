const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Entity = db.define('entity', {
    wallet: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    website: {
        type: Sequelize.STRING
    },
    pic: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    role: {
        type: Sequelize.STRING,
    }
});

module.exports = Entity;