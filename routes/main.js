const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const Entity = require("../models/Entity");
const Individual = require("../models/Individual");

// Required for file upload
const fs = require('fs');
const { HiUpload, bUpload, mUpload } = require('../helpers/imageUpload');

// Decrypt ciphertext
const CryptoJS = require('crypto-js');

// connect to blockchain
const Web3 = require('web3');
const MyContract = require('../build/contracts/idee.json');
const e = require('connect-flash');

// register healthcare institution
const registerHI = async (address, name, website) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    contract.methods.registerHI(address, name, website).send({
        from: address,
        gas: 1000000,
        gasPrice: 1000000000,
        gasLimit: 1000000
    });
};

// register business
const registerBusiness = async (address, name, website) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    contract.methods.registerBusiness(address, name, website).send({
        from: address,
        gas: 1000000,
        gasPrice: 1000000000,
        gasLimit: 1000000
    });
};

// register migrant
const registerMigrant = async (address, name, nationality, gender, identificationNo, dob) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    contract.methods.registerMigrant(address, name, nationality, gender, identificationNo, dob).send({
        from: address,
        gas: 1000000,
        gasPrice: 1000000000,
        gasLimit: 1000000
    });
};

// register local
const registerLocal = async (address, name, nationality, gender, identificationNo, dob) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    contract.methods.registerLocal(address, name, nationality, gender, identificationNo, dob).send({
        from: address,
        gas: 1000000,
        gasPrice: 1000000000,
        gasLimit: 1000000
    });
};

// check healthcare institution
const checkHI = async (address) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    var result = contract.methods.checkInstitution(address).call();
    return result;
};

// check business 
const checkB = async (address) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    var result = contract.methods.checkBusiness(address).call();
    return result;
};

// check migrant 
const checkM = async (address) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    var result = contract.methods.checkMigrant(address).call();
    return result;
};

// check local 
const checkL = async (address) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    var result = contract.methods.checkLocal(address).call();
    return result;
};

// check admin 
const checkA = async (address) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    var result = contract.methods.checkAdmin(address).call();
    return result;
};

// get migrant's sensitive data
const getM = async (address) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    var result = contract.methods.getmDetail(address).call();
    return result;
};

// get local's sensitive data
const getL = async (address) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    var result = contract.methods.getlDetail(address).call();
    return result;
};

router.get('/', (req, res) => {
    res.render('index', {
    }) // renders views/index.handlebars
});

router.get('/login/:address', (req, res) => {
    var encryptedAddress = req.params.address;
    const encoded = CryptoJS.enc.Base64.parse(encryptedAddress);
    const walletAddress = CryptoJS.enc.Utf8.stringify(encoded);
    req.session.wallet = walletAddress;
    // Check if admin logged in
    var resultA = checkA(walletAddress);
    resultA.then(resultA => {
        if (resultA == true) {
            res.redirect('/adminHome');
        } else {
            var resultHi = checkHI(walletAddress);
            resultHi.then(resultHi => {
                if (resultHi == 3) {
                    res.redirect('/HiHome');
                } else if (resultHi == 1) {
                    alertMessage(
                        res,
                        'danger',
                        'Account is waiting to be verified. You will receive an email upon successful verification.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else if (resultHi == 4) {
                    alertMessage(
                        res,
                        'danger',
                        'Oops! Your account was deactivated.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else {
                    var resultB = checkB(walletAddress);
                    resultB.then(resultB => {
                        if (resultB == 3) {
                            res.redirect('/businessHome');
                        } else if (resultB == 1) {
                            alertMessage(
                                res,
                                'danger',
                                'Account is waiting to be verified. You will receive an email upon successful verification.',
                                '',
                                true
                            )
                            res.redirect('/');
                        } else if (resultB == 4) {
                            alertMessage(
                                res,
                                'danger',
                                'Oops! Your account was deactivated.',
                                '',
                                true
                            )
                            res.redirect('/');
                        } else {
                            var resultM = checkM(walletAddress);
                            resultM.then(resultM => {
                                if (resultM == true) {
                                    res.redirect('/migrantHome');
                                } else {
                                    var resultL = checkL(walletAddress);
                                    resultL.then(resultL => {
                                        if (resultL == true) {
                                            res.redirect('/localHome');
                                        } else {
                                            alertMessage(
                                                res,
                                                'danger',
                                                'Account not registered yet. Please register first.',
                                                '',
                                                true
                                            )
                                            res.redirect('/');
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

// Admin homepage
router.get('/adminHome', ensureAuthenticated, (req, res) => {
    let wallet = req.session.wallet;
    res.render('admin/aHome', {
        wallet: wallet
    })
});

// Healthcare institution homepage
router.get('/HiHome', ensureAuthenticated, (req, res) => {
    var walletAddress = req.session.wallet;
    Entity.findOne({
        where: {
            wallet: walletAddress
        }
    }).then((institution) => {
        res.render('institution/iHome', {
            name: institution.name
        })
    })
});

// Business homepage
router.get('/businessHome', ensureAuthenticated, (req, res) => {
    var walletAddress = req.session.wallet;
    Entity.findOne({
        where: {
            wallet: walletAddress
        }
    }).then((business) => {
        res.render('business/bHome', {
            name: business.name
        })
    })
});

// Migrant homepage
router.get('/migrantHome', ensureAuthenticated, (req, res) => {
    var walletAddress = req.session.wallet;
    
    // Get migrant details from blockchain
    var migrantBlockchain = getM(walletAddress);
    migrantBlockchain.then((migrantBlockchain) => {

        // Get other migrant details from sql
        Individual.findOne({
            where: {
                wallet: walletAddress
            }
        }).then((migrant) => {
            res.render('migrant/mHome', {
                migrant: migrant,
                identificationNo: migrantBlockchain[4],
            })
        })
    })
});

// Local homepage
router.get('/localHome', ensureAuthenticated, (req, res) => {
    var walletAddress = req.session.wallet;
    
    // Get local's details from blockchain
    var localBlockchain = getL(walletAddress);
    localBlockchain.then((localBlockchain) => {

        // Get other migrant details from sql
       Individual.findOne({     
            where: {
                wallet: walletAddress
            }
        }).then((local) => {
            res.render('local/lHome', {
                local: local,
                identificationNo: localBlockchain[4],
            })
        })
    })
});

// Healthcare institution registration form's upload profile image
router.post('/HiUpload', (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/')) {
        fs.mkdirSync('./public/uploads/')
    }

    HiUpload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/noProfile.png' })
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/noProfile.png', err: err });
            } else {
                res.json({ file: `/uploads/${req.file.filename}` });
            }
        }
    });
});

// Business registration form's upload profile image
router.post('/bUpload', (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/')) {
        fs.mkdirSync('./public/uploads/')
    }

    bUpload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/noProfile.png' })
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/noProfile.png', err: err });
            } else {
                res.json({ file: `/uploads/${req.file.filename}` });
            }
        }
    });
});

// Migrant registration form's upload profile image
router.post('/mUpload', (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/')) {
        fs.mkdirSync('./public/uploads/')
    }

    mUpload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/noProfile.png' })
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/noProfile.png', err: err });
            } else {
                res.json({ file: `/uploads/${req.file.filename}` });
            }
        }
    });
});

// Register healthcare institution
router.post('/registerHi/:address', (req, res) => {
    // store in blockchain
    var address = req.params.address;
    var name = req.body.HiName;
    var website = req.body.HiWebsite;

    // store in mysql
    var pic = req.body.HiURL;

    // Check if healthcare institution account exists
    var resultHI = checkHI(address);
    resultHI.then(resultHI => {
        if (resultHI == 3) {
            alertMessage(
                res,
                'danger',
                'Account already registered as Healthcare Institution. Please login.',
                '',
                true
            )
            res.redirect('/');
        } else if (resultHI == 1) {
            alertMessage(
                res,
                'danger',
                'Account is waiting to be verified. You will receive an email upon successful verification.',
                '',
                true
            )
            res.redirect('/');
        } else if (resultHI == 4) {
            alertMessage(
                res,
                'danger',
                'Oops! Your account was deactivated.',
                '',
                true
            )
            res.redirect('/');
        } else {
            // Check if business account exists
            var resultB = checkB(address);
            resultB.then(resultB => {
                if (resultB == 3) {
                    alertMessage(
                        res,
                        'danger',
                        'Account already registered as Business. Please login.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else if (resultB == 1) {
                    alertMessage(
                        res,
                        'danger',
                        'Account is waiting to be verified. You will receive an email upon successful verification.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else if (resultB == 4) {
                    alertMessage(
                        res,
                        'danger',
                        'Oops! Your account was deactivated.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else {
                    // Check if migrant account exists
                    var resultM = checkM(address);
                    resultM.then(resultM => {
                        if (resultM == true) {
                            alertMessage(
                                res,
                                'danger',
                                'Account already registered as Migrant. Please login.',
                                '',
                                true
                            )
                            res.redirect('/');
                        } else {
                            // Check if admin account exists
                            var resultA = checkA(address);
                            resultA.then(resultA => {
                                if (resultA == true) {
                                    alertMessage(
                                        res,
                                        'danger',
                                        'Oops! This account has been reserved for administrators.',
                                        '',
                                        true
                                    )
                                    res.redirect('/');
                                } else {
                                    // Check if local account exists
                                    var resultL = checkL(address);
                                    resultL.then(resultL => {
                                        if (resultL == true) {
                                            alertMessage(
                                                res,
                                                'danger',
                                                'Account already registered as Local. Please login.',
                                                '',
                                                true
                                            )
                                            res.redirect('/');
                                        } else {
                                            // call blockchain contract to register migrant
                                            registerHI(address, name, website);

                                            // store data with high update rate in sql
                                            Entity.create({
                                                wallet: address,
                                                name: name,
                                                website: website,
                                                pic: pic,
                                                role: 'Healthcare Institution'
                                            })

                                            alertMessage(
                                                res,
                                                'success',
                                                `Successfully registered ${name} as Healthcare Institution! Verification in process.`,
                                                '',
                                                true
                                            )
                                            res.redirect('/');
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

// Register business
router.post('/registerBusiness/:address', (req, res) => {
    // store in blockchain
    var address = req.params.address;
    var name = req.body.bName;
    var website = req.body.bWebsite;

    // store in mysql
    var pic = req.body.bURL;

    // Check if healthcare institution account exists
    var resultHI = checkHI(address);
    resultHI.then(resultHI => {
        if (resultHI == 3) {
            alertMessage(
                res,
                'danger',
                'Account already registered as Healthcare Institution. Please login.',
                '',
                true
            )
            res.redirect('/');
        } else if (resultHI == 1) {
            alertMessage(
                res,
                'danger',
                'Account is waiting to be verified. You will receive an email upon successful verification.',
                '',
                true
            )
            res.redirect('/');
        } else if (resultHI == 4) {
            alertMessage(
                res,
                'danger',
                'Oops! Your account was deactivated.',
                '',
                true
            )
            res.redirect('/');
        } else {
            // Check if business account exists
            var resultB = checkB(address);
            resultB.then(resultB => {
                if (resultB == 3) {
                    alertMessage(
                        res,
                        'danger',
                        'Account already registered as Business. Please login.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else if (resultB == 1) {
                    alertMessage(
                        res,
                        'danger',
                        'Account is waiting to be verified. You will receive an email upon successful verification.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else if (resultB == 4) {
                    alertMessage(
                        res,
                        'danger',
                        'Oops! Your account was deactivated.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else {
                    // Check if migrant account exists
                    var resultM = checkM(address);
                    resultM.then(resultM => {
                        if (resultM == true) {
                            alertMessage(
                                res,
                                'danger',
                                'Account already registered as Migrant. Please login.',
                                '',
                                true
                            )
                            res.redirect('/');
                        } else {
                            // Check if admin account exists
                            var resultA = checkA(address);
                            resultA.then(resultA => {
                                if (resultA == true) {
                                    alertMessage(
                                        res,
                                        'danger',
                                        'Oops! This account has been reserved for administrators.',
                                        '',
                                        true
                                    )
                                    res.redirect('/');
                                } else {
                                    // Check if local account exists
                                    var resultL = checkL(address);
                                    resultL.then(resultL => {
                                        if (resultL == true) {
                                            alertMessage(
                                                res,
                                                'danger',
                                                'Account already registered as Local. Please login.',
                                                '',
                                                true
                                            )
                                            res.redirect('/');
                                        } else {
                                            // call blockchain contract to register migrant
                                            registerBusiness(address, name, website);

                                            // store high update rate data in sql
                                            Entity.create({
                                                wallet: address,
                                                name: name,
                                                website: website,
                                                pic: pic,
                                                role: 'Business'
                                            })

                                            alertMessage(
                                                res,
                                                'success',
                                                `Successfully registered ${name} as Business! Verification in process.`,
                                                '',
                                                true
                                            )
                                            res.redirect('/');
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

// Register Local/Migrant
router.post('/registerLM/:address', (req, res) => {
    // store in blockchain
    var walletAddress = req.params.address;
    var nationality = req.body.mNationality;
    var gender = req.body.mGender;
    var identificationNo = req.body.mID;
    var dob = req.body.mDOB;

    // store in mysql
    var name = req.body.mName;
    var pic = req.body.mURL;
    var address = req.body.mAddress;
    var contact = req.body.mContact;
    var email = req.body.mEmail;

    // Check if healthcare institution account exists
    var resultHI = checkHI(walletAddress);
    resultHI.then(resultHI => {
        if (resultHI == 3) {
            alertMessage(
                res,
                'danger',
                'Account already registered as Healthcare Institution. Please login.',
                '',
                true
            )
            res.redirect('/');
        } else if (resultHI == 1) {
            alertMessage(
                res,
                'danger',
                'Account is waiting to be verified. You will receive an email upon successful verification.',
                '',
                true
            )
            res.redirect('/');
        } else if (resultHI == 4) {
            alertMessage(
                res,
                'danger',
                'Oops! Your account was deactivated.',
                '',
                true
            )
            res.redirect('/');
        } else {
            // Check if business account exists
            var resultB = checkB(walletAddress);
            resultB.then(resultB => {
                if (resultB == 3) {
                    alertMessage(
                        res,
                        'danger',
                        'Account already registered as Business. Please login.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else if (resultB == 1) {
                    alertMessage(
                        res,
                        'danger',
                        'Account is waiting to be verified. You will receive an email upon successful verification.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else if (resultB == 4) {
                    alertMessage(
                        res,
                        'danger',
                        'Oops! Your account was deactivated.',
                        '',
                        true
                    )
                    res.redirect('/');
                } else {
                    // Check if migrant account exists
                    var resultM = checkM(walletAddress);
                    resultM.then(resultM => {
                        if (resultM == true) {
                            alertMessage(
                                res,
                                'danger',
                                'Account already registered as Migrant. Please login.',
                                '',
                                true
                            )
                            res.redirect('/');
                        } else {
                            // Check if admin account exists
                            var resultA = checkA(walletAddress);
                            resultA.then(resultA => {
                                if (resultA == true) {
                                    alertMessage(
                                        res,
                                        'danger',
                                        'Oops! This account has been reserved for administrators.',
                                        '',
                                        true
                                    )
                                    res.redirect('/');
                                } else {
                                    // Check if local account exists
                                    var resultL = checkL(walletAddress);
                                    resultL.then(resultL => {
                                        if (resultL == true) {
                                            alertMessage(
                                                res,
                                                'danger',
                                                'Account already registered as Local. Please login.',
                                                '',
                                                true
                                            )
                                            res.redirect('/');
                                        } else {
                                            if (nationality == 'Singapore') {
                                                // call blockchain contract to register migrant
                                                registerLocal(walletAddress, name, nationality, gender, identificationNo, dob);

                                                // store high update rate data in sql
                                                Individual.create({
                                                    wallet: walletAddress,
                                                    name: name,
                                                    pic: pic,
                                                    address: address,
                                                    contact: contact,
                                                    email: email,
                                                    role: 'Local'
                                                });

                                                alertMessage(
                                                    res,
                                                    'success',
                                                    `Successfully registered ${name} as Local! Please login.`,
                                                    '',
                                                    true
                                                )
                                                res.redirect('/');
                                            } else {
                                                // call blockchain contract to register migrant
                                                registerMigrant(walletAddress, name, nationality, gender, identificationNo, dob);

                                                // store high update rate data in sql
                                                Individual.create({
                                                    wallet: walletAddress,
                                                    name: name,
                                                    pic: pic,
                                                    address: address,
                                                    contact: contact,
                                                    email: email,
                                                    role: 'Migrant'
                                                });

                                                alertMessage(
                                                    res,
                                                    'success',
                                                    `Successfully registered ${name} as Migrant! Please login.`,
                                                    '',
                                                    true
                                                )
                                                res.redirect('/');
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

// Logout User
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


// count business 
const countB = async (address) => {
    const web3 = new Web3("http://127.0.0.1:7545");

    const id = await web3.eth.net.getId();
    const deployedNetwork = MyContract.networks[id];
    const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork.address
    );

    var result = contract.methods.hiCount().call();
    return result;
};

router.get('/about', (req, res) => {
    var resultC = countB();
    resultC.then(resultC => {
        console.log(resultC);
    })
})

module.exports = router;
