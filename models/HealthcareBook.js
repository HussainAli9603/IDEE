const Sequelize = require('sequelize');
const db = require('../config/DBConfig');


const HealthcareBook = db.define('healthcarebook', {
    
    book_date: {
        type: Sequelize.STRING
    },
    book_institute: {
        type: Sequelize.STRING
    },
    book_slottime: {
        type: Sequelize.STRING
    },
    confirmation: {
        type: Sequelize.STRING
    }

});

module.exports = HealthcareBook;