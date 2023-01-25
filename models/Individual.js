const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

const Individual = db.define('individual', {
    wallet: {
        type: Sequelize.STRING
    },
    name:{
        type: Sequelize.STRING
    },
    pic: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    contact: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.STRING
    },
});

module.exports = Individual;