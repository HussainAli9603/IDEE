const mySQLDB = require('./DBConfig');
const Entity = require("../models/Entity");
const Individual = require("../models/Individual");
const HealthcareImm = require("../models/HealthcareImm");

const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
        console.log("IDEE database connected");
    })
    .then(() => {
        //user.hasMany(video);
        HealthcareImm.belongsTo(Individual, {
            foreignKey: 'id',
            targetKey: 'id',
            as: 'individual'
        });
        
        mySQLDB.sync({
            force: drop
        }).then(() => {
            console.log("Create tables if none exists")
        }).catch(err => console.log(err))
    })
    .catch(err => console.log("Error: " + err));
};

module.exports = { setUpDB };