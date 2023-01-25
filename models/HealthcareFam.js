const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const HealthcareFam = db.define('healthcarefam', {
    
    fam_relationship: {
        type: Sequelize.STRING
    },
    fam_healthrisk: {
        type: Sequelize.STRING
    },
    fam_date: {
        type: Sequelize.STRING
    },
    migrant_id2: {
        type: Sequelize.STRING
    }

});

module.exports = HealthcareFam;