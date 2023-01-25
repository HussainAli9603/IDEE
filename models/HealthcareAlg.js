const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const HealthcareAlg = db.define('healthcarealg', {
    
    alg_to: {
        type: Sequelize.STRING
    },
    alg_react: {
        type: Sequelize.STRING
    },
    alg_date: {
        type: Sequelize.STRING
    },
    migrant_id4: {
        type: Sequelize.STRING
    }

});

module.exports = HealthcareAlg;