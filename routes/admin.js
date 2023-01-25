const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const Entity = require("../models/Entity");
const Individual = require("../models/Individual");
const { Op } = require("sequelize");

// connect to blockchain
const Web3 = require('web3');
const MyContract = require('../build/contracts/idee.json');

// update status of healthcare institution
const updateHI = async (address, name, website, status) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    contract.methods.updateHI(address, name, website, status).send({
        from: address,
        gas: 1000000,
        gasPrice: 1000000000,
        gasLimit: 1000000
    });
};

// update status of business
const updateB = async (address, name, website, status) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    contract.methods.updateBusiness(address, name, website, status).send({
        from: address,
        gas: 1000000,
        gasPrice: 1000000000,
        gasLimit: 1000000
    });
};

router.get("/applications", (req, res) => {
    // Applications (not verified yet)
    Entity.findAll({
        where: {
            status: 1
        }
    }).then((entity) => {
        // Applications verified
        Entity.findAll({
            where: {
                status: {
                    [Op.or]: [3, 4]
                }
            }
        }).then((verified) => {
            res.render("admin/applications", {
                entity,
                verified,
            })
        })
    })
});

router.get("/accept/:id", (req, res) => {
    var acceptedId = req.params.id;

    // Retrieve wallet address of accepted entity
    Entity.findOne({
        where: {
            id: acceptedId
        }
    }).then((entity) => {
        var walletAddress = entity.wallet;
        var name = entity.name;
        var website = entity.website;

        // update status in sql
        Entity.update({
            status: 3
        }, {
            where: {
                id: acceptedId
            }
        }).then(() => {
            // update status in blockchain
            if (entity.role == 'Business') {
                updateB(walletAddress, name, website, 3) // set status = 3, means verified
            } else {
                updateHI(walletAddress, name, website, 3) // set status = 3, means verified
            }

            alertMessage(
                res,
                'success',
                'Application has been successfully verified.',
                '',
                true
            )

            // need to send email to them


            res.redirect('/admin/applications')
        })
    })
});

router.get("/reject/:id", (req, res) => {
    var acceptedId = req.params.id;

    // Retrieve wallet address of accepted entity
    Entity.findOne({
        where: {
            id: acceptedId
        }
    }).then((entity) => {
        var walletAddress = entity.wallet;
        var name = entity.name;
        var website = entity.website;

        // remove application in sql
        Entity.destroy({
            where: {
                id: acceptedId
            }
        }).then(() => {
            // update status in blockchain
            if (entity.role == 'Business') {
                updateB(walletAddress, name, website, 2) // set status = 2, means rejected
            } else {
                updateHI(walletAddress, name, website, 2) // set status = 2, means rejected
            }

            alertMessage(
                res,
                'success',
                'Application has been successfully rejected.',
                '',
                true
            )

            // need to send email to them

            
            res.redirect('/admin/applications')
        })
    })
});

router.get("/deactivate/:id", (req, res) => {
    var acceptedId = req.params.id;

    // Retrieve wallet address of accepted entity
    Entity.findOne({
        where: {
            id: acceptedId
        }
    }).then((entity) => {
        var walletAddress = entity.wallet;
        var name = entity.name;
        var website = entity.website;

        // update status in sql
        Entity.update({
            status: 4 // 4 means deactivate
        }, {
            where: {
                id: acceptedId
            }
        }).then(() => {
            // update status in blockchain
            if (entity.role == 'Business') {
                updateB(walletAddress, name, website, 4) // set status = 4, means deactivated
            } else {
                updateHI(walletAddress, name, website, 4) // set status = 4, means deactivated
            }

            alertMessage(
                res,
                'success',
                'Account has been successfully deactivated.',
                '',
                true
            )

            // need to send email to them

            
            res.redirect('/admin/applications')
        })
    })
});

router.get("/activate/:id", (req, res) => {
    var acceptedId = req.params.id;

    // Retrieve wallet address of accepted entity
    Entity.findOne({
        where: {
            id: acceptedId
        }
    }).then((entity) => {
        var walletAddress = entity.wallet;
        var name = entity.name;
        var website = entity.website;

        // update status in sql
        Entity.update({
            status: 3 // 3 means verified
        }, {
            where: {
                id: acceptedId
            }
        }).then(() => {
            // update status in blockchain
            if (entity.role == 'Business') {
                updateB(walletAddress, name, website, 3) // set status = 3, means deactivated
            } else {
                updateHI(walletAddress, name, website, 3) // set status = 3, means deactivated
            }

            alertMessage(
                res,
                'success',
                'Account has been successfully activated.',
                '',
                true
            )

            // need to send email to them

            
            res.redirect('/admin/applications')
        })
    })
});

router.get("/showCreateCampaign", (req, res) => {
    res.render("admin/createCampaign", {
        
    })
})

module.exports = router;