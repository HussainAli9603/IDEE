const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const HealthcareMed = db.define('healthcaremed', {
    
    med_institute: {
        type: Sequelize.STRING
    },
    med_date: {
        type: Sequelize.STRING
    },
    med_provided: {
        type: Sequelize.STRING
    },
    
    migrant_id3: {
        type: Sequelize.STRING
    }

});

module.exports = HealthcareMed;