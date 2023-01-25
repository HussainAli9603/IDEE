const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const HealthcareImm = db.define('healthcareimm', {
    
    immunisation_date: {
        type: Sequelize.STRING
    },
    vac_type: {
        type: Sequelize.STRING
    },
    vac_location: {
        type: Sequelize.STRING
    },
    migrant_id: {
        type: Sequelize.STRING
    }

});

module.exports = HealthcareImm;