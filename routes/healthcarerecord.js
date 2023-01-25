const express = require("express");
const router = express.Router();
const Individual = require("../models/Individual");
const HealthcareImm = require("../models/HealthcareImm");
const HealthcareFam = require("../models/HealthcareFam");
const HealthcareMed= require("../models/HealthcareMed");
const HealthcareAlg= require("../models/HealthcareAlg");
const HealthcareBook= require("../models/HealthcareBook");
const alertMessage = require("../helpers/messenger");
const Entity = require("../models/Entity");
const ensureAuthenticated = require("../helpers/auth");
const moment = require('moment');

const fs = require('fs');
const upload = require('../helpers/imageUpload'); 
const bodyParser = require('body-parser');
const { Op } = require("sequelize");

const H = require('just-handlebars-helpers');





router.get("/healthcarerecord", (req, res) => {
    res.render("institution/healthcarerecord", {
    });
});

router.get("/iHome", ensureAuthenticated, (req, res) => {
   
    HealthcareImm.findAll({
       
        
        
    }).then((healthcarerecord) => {
        
        let resultsFound = healthcarerecord.length;
        res.render("institution/iHome", {
            healthcarerecord: healthcarerecord,
            resultsFound: resultsFound,
          });
    }).catch((err) => console.log(err));
});

router.get("/migranthealth", ensureAuthenticated, (req, res) => {
    var walletAddress = req.session.wallet;
    Individual.findOne({
        where: {
            wallet: walletAddress
        }
    }).then((individual) => {
        var migrantname = individual.name
        var migrantid = individual.id
        res.render("institution/migranthealth", {
            name: individual.name,
            id: individual.id
        });
    }).catch((err) => console.log(err));
});


router.get("/migrantviewimm/:id", ensureAuthenticated, (req, res) => {
    var walletAddress = req.session.wallet;
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            wallet: walletAddress
        }
    }).then((individual) => {
        
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/migrantviewimm", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});


router.get("/migrantviewfam/:id", ensureAuthenticated, (req, res) => {
    var walletAddress = req.session.wallet;
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            wallet: walletAddress
        }
    }).then((individual) => {
        
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/migrantviewfam", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});

router.get("/migrantmed/:id", ensureAuthenticated, (req, res) => {
    var walletAddress = req.session.wallet;
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            wallet: walletAddress
        }
    }).then((individual) => {
        
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/migrantmed", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});

router.get("/migrantmed2/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    // Find all record by its ID
    HealthcareMed.findAll({
        attributes: ['med_institute', 'med_date', 'med_provided','id'],
        where: {
            
            migrant_id3:id
        }
    }).then((results) => {
        res.render("institution/migrantmed2", {
            results: results
        });
    }).catch((err) => console.log(err));
});


router.get("/viewfammigrant/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    // Find all record by its ID

    HealthcareFam.findAll({
        attributes: ['fam_relationship', 'fam_date', 'fam_healthrisk','id'],
        where: {
            migrant_id2:id,
        },
        raw: true
    }).then(families => {
        // Group data by fam_relationship
        const groupedData = families.reduce((acc, cur) => {
            if (!acc[cur.fam_relationship]) {
                acc[cur.fam_relationship] = []
            }
            acc[cur.fam_relationship].push(cur)
            return acc
        }, {})
        
        res.render("institution/viewfammigrant", {
            results: families,
            groupedData: groupedData
        });
    }).catch((err) => console.log(err));
});




router.get("/viewmigrantimm2/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    // Find all record by its ID
    HealthcareImm.findAll({
        attributes: ['immunisation_date', 'vac_type', 'vac_location','id'],
        where: {
            
            migrant_id:id
        }
    }).then((results) => {
        res.render("institution/viewmigrantimm2", {
            results: results
        });
    }).catch((err) => console.log(err));
});

router.get("/migrantallergy/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/migrantallergy", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});

router.get("/migrantallergy2/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    // Find all record by its ID
    HealthcareAlg.findAll({
        attributes: ['alg_to', 'alg_date', 'alg_react','id'],
        where: {
            
            migrant_id4:id
        }
    }).then((results) => {
        res.render("institution/migrantallergy2", {
            results: results
        });
    }).catch((err) => console.log(err));
});


router.get("/healthcarerecord", ensureAuthenticated, (req, res) => {
   
    HealthcareImm.findAll({
        attributes: ['id','name', 'address', 'contact', 'email','role'], 
        
        
    }).then((healthcarerecord) => {
        
        let resultsFound = healthcarerecord.length;
        res.render("healthcarerecord/healthcarerecord", {
            healthcarerecord: healthcarerecord,
            resultsFound: resultsFound,
          });
    }).catch((err) => console.log(err));
});


router.post('/search', ensureAuthenticated, (req, res) => {
    const searchName = req.body.searchName;
    let count = 0; // Initialize count to 0
    Individual.findAll({
        attributes: ['id','name', 'address', 'contact', 'email','role'], 
        where: {
            name: {
                [Op.like]: `%${searchName}%`
            }
        }
    }).then((result) => {
        result.forEach(() => {
            count++;
        });
        res.render('institution/healthcarerecord', {
            results: result,
            count:count
        });
    }).catch((err) => {
        console.log(err);
        res.render('institution/healthcarerecord', {
            message: 'An error occurred'
        });
    });
});




router.get("/healthcarerecord2/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        attributes: ['id','name', 'address', 'contact', 'email','role'], 
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/healthcarerecord2", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});


//IMMUNISATIONS -------------------------------------------------------------------------------------------------------------------------

router.get("/aimmunisation/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/aimmunisation", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});


router.get("/addimmun/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/addimmun", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});

router.post("/addimmun/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    const {immunisation_date, vac_type, vac_location} = req.body;

    include: [{
        model: Individual,
        attributes: ['id'],
        required:false
    }]

    HealthcareImm.create({
        immunisation_date: immunisation_date,
        vac_type: vac_type,
        vac_location: vac_location,
        migrant_id: id,
    }).then(() => {
        alertMessage(res, 'success', 'Immunisation Record successfully added', 'fa-solid fa-square-plus', true);
        res.redirect(`/healthcarerecord/aimmunisation/${req.params.id}`);
    }).catch((err) => {
        console.log(err);
        alertMessage(res, 'danger', 'An error occurred', 'fa-solid fa-exclamation-circle', true);
        res.redirect(`/healthcarerecord/aimmunisation/${req.params.id}`);
    });
});

router.get("/viewimmun/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    // Find all record by its ID
    
    HealthcareImm.findAll({
        attributes: ['immunisation_date', 'vac_type', 'vac_location','id'],
        where: {
            
            migrant_id:id
        }
    }).then((results) => {
        res.render("institution/viewimmun", {
            results: results,
            id:id
        });
    }).catch((err) => console.log(err));
});



router.get("/editimmun/:id",ensureAuthenticated, (req, res) => {
    HealthcareImm.findOne({
        attributes: ['immunisation_date', 'vac_type', 'vac_location','id','migrant_id'],
      where: {
        id: req.params.id
      }
    }).then((individual) => {
        
      res.render("institution/editimmun", {
        individual: individual
        
      });
    }).catch((err) => console.log(err));
  });

router.put("/immunEdit/:id", (req, res) => {
    let errors = [];
    
    let immunisation_date = req.body.immunisation_date;
    let vac_type= req.body.vac_type;
    let vac_location = req.body.vac_location;

    if (errors.length > 0) {
        res.render("../../healthcarerecord/healthcarerecord"+ req.params.id, {
            errors,
            immunisation_date,
            vac_type,
            vac_location,
            
        })
    } else {
        HealthcareImm.update({
            attributes: ['migrant_id'],
            immunisation_date,
            vac_type,
            vac_location,
            
        }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Vaccination record successfully updated', 'fa-solid fa-square-plus', true);
            res.redirect('../../healthcarerecord/healthcarerecord');
        }).catch((err) => console.log(err))
    }
});


router.get("/deleteImmun/:id", ensureAuthenticated, (req, res) => {
    
    HealthcareImm.findOne({
        attributes: ['migrant_id'],
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        

        HealthcareImm.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Immunity successfully Deleted', 'fa-solid fa-square-plus', true);
            res.redirect('../../healthcarerecord/viewimmun/'+ individual.migrant_id);
        })
    })
});


// END IMMUNISATIONS -------------------------------------------------------------------------------------------------------------------------







//FAMILY RECORD-------------------------------------------------------------------------------------------------------------------------
router.get("/afamily/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/afamily", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});

router.get("/addfamily/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/addfamily", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});



router.post("/addfamily/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    const {fam_date, fam_relationship, fam_healthrisk} = req.body;

    include: [{
        model: Individual,
        attributes: ['id'],
        required:false
    }]

    HealthcareFam.create({
        fam_date: fam_date,
        fam_relationship: fam_relationship,
        fam_healthrisk: fam_healthrisk,
        migrant_id2: id,
    }).then(() => {
        alertMessage(res, 'success', 'Immunisation Record successfully added', 'fa-solid fa-square-plus', true);
        res.redirect(`/healthcarerecord/afamily/${req.params.id}`);
    }).catch((err) => {
        console.log(err);
        alertMessage(res, 'danger', 'An error occurred', 'fa-solid fa-exclamation-circle', true);
        res.redirect(`/healthcarerecord/afamily/${req.params.id}`);
    });
});

router.get("/viewfamily/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    // Find all record by its ID

    HealthcareFam.findAll({
        attributes: ['fam_relationship', 'fam_date', 'fam_healthrisk','id'],
        where: {
            migrant_id2:id,
        },
        raw: true
    }).then(families => {
        // Group data by fam_relationship
        const groupedData = families.reduce((acc, cur) => {
            if (!acc[cur.fam_relationship]) {
                acc[cur.fam_relationship] = []
            }
            acc[cur.fam_relationship].push(cur)
            return acc
        }, {})
        
        res.render("institution/viewfamily", {
            results: families,
            id:id,
            groupedData: groupedData
        });
    }).catch((err) => console.log(err));
});

router.get("/editfamily/:id",ensureAuthenticated, (req, res) => {
    HealthcareFam.findOne({
        attributes: ['fam_date', 'fam_relationship', 'fam_healthrisk','id'],
      where: {
        id: req.params.id
      }
    }).then((individual) => {
        
      res.render("institution/editfamily", {
        individual: individual
      });
    }).catch((err) => console.log(err));
  });

  router.put("/familyedit/:id", (req, res) => {
    let errors = [];
    
    let fam_date = req.body.fam_date;
    let fam_relationship= req.body.fam_relationship;
    let fam_healthrisk = req.body.fam_healthrisk;

    if (errors.length > 0) {
        res.render("../../healthcarerecord/healthcarerecord"+ req.params.id, {
            errors,
            fam_date,
            fam_relationship,
            fam_healthrisk,
            
        })
    } else {
        HealthcareFam.update({
            attributes: ['migrant_id2'],
            fam_date,
            fam_relationship,
            fam_healthrisk,
            
        }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Family record successfully updated', 'fa-solid fa-square-plus', true);
            res.redirect('../../healthcarerecord/healthcarerecord');
        }).catch((err) => console.log(err))
    }
});

router.get("/deletefamily/:id", ensureAuthenticated, (req, res) => {
    
    HealthcareFam.findOne({
        attributes: ['migrant_id2'],
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        

        HealthcareFam.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Record successfully Deleted', 'fa-solid fa-square-plus', true);
            res.redirect('../../healthcarerecord/viewfamily/'+ individual.migrant_id2);
        })
    })
});

//END FAMILYRECORD -------------------------------------------------------------------------------------------------------------------------

//START MEDICALRECORD -------------------------------------------------------------------------------------------------------------------------

router.get("/amedical/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/amedical", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});


router.get("/addmedical/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/addmedical", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});

router.post("/addmedical/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    const {med_institute, med_date, med_provided} = req.body;

    include: [{
        model: Individual,
        attributes: ['id'],
        required:false
    }]

    HealthcareMed.create({
        med_institute: med_institute,
        med_date: med_date,
        med_provided: med_provided,
        
        migrant_id3: id,
    }).then(() => {
        alertMessage(res, 'success', 'Immunisation Record successfully added', 'fa-solid fa-square-plus', true);
        res.redirect(`/healthcarerecord/amedical/${req.params.id}`);
    }).catch((err) => {
        console.log(err);
        alertMessage(res, 'danger', 'An error occurred', 'fa-solid fa-exclamation-circle', true);
        res.redirect(`/healthcarerecord/amedical/${req.params.id}`);
    });
});

router.get("/viewmedical/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    // Find all record by its ID
    HealthcareMed.findAll({
        attributes: ['med_institute', 'med_date', 'med_provided','id'],
        where: {
            
            migrant_id3:id
        }
    }).then((results) => {
        res.render("institution/viewmedical", {
            results: results,
            id:id
        });
    }).catch((err) => console.log(err));
});

router.get("/editmedical/:id",ensureAuthenticated, (req, res) => {
    HealthcareMed.findOne({
        attributes: ['med_institute', 'med_date', 'med_provided','id'],
      where: {
        id: req.params.id
      }
    }).then((individual) => {
        
      res.render("institution/editmedical", {
        individual: individual
      });
    }).catch((err) => console.log(err));
  });

  router.put("/medicalEdit/:id", (req, res) => {
    let errors = [];
    
    let med_institute = req.body.med_institute;
    let med_date= req.body.med_date;
    let med_provided = req.body.med_provided;

    if (errors.length > 0) {
        res.render("../../healthcarerecord/healthcarerecord"+ req.params.id, {
            errors,
            med_institute,
            med_date,
            med_provided,
            
        })
    } else {
        HealthcareMed.update({
            attributes: ['migrant_id3'],
            med_institute,
            med_date,
            med_provided,
            
        }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Medication record successfully updated', 'fa-solid fa-square-plus', true);
            res.redirect('../../healthcarerecord/healthcarerecord');
        }).catch((err) => console.log(err))
    }
});

router.get("/deletemedical/:id", ensureAuthenticated, (req, res) => {
    
    HealthcareMed.findOne({
        attributes: ['migrant_id3'],
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        

        HealthcareMed.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Medication Record successfully Deleted', 'fa-solid fa-square-plus', true);
            res.redirect('../../healthcarerecord/viewmedical/'+ individual.migrant_id3);
        })
    })
});

//END MEDICALRECORD -------------------------------------------------------------------------------------------------------------------------


//START ALLERGYRECORD -------------------------------------------------------------------------------------------------------------------------

router.get("/aallergies/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/aallergies", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});


router.get("/addallergy/:id", ensureAuthenticated, (req, res) => {
    // Find the individual record by its ID
    Individual.findOne({
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        // Render healthcarerecord2.handlebars and pass in the individual data
        res.render("institution/addallergy", {
            individual: individual
        });
    }).catch((err) => console.log(err));
});


router.post("/addallergy/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    const {alg_to, alg_date, alg_react} = req.body;

    include: [{
        model: Individual,
        attributes: ['id'],
        required:false
    }]

    HealthcareAlg.create({
        alg_to: alg_to,
        alg_date: alg_date,
        alg_react: alg_react,
        migrant_id4: id,
    }).then(() => {
        alertMessage(res, 'success', 'Immunisation Record successfully added', 'fa-solid fa-square-plus', true);
        res.redirect(`/healthcarerecord/aallergies/${req.params.id}`);
    }).catch((err) => {
        console.log(err);
        alertMessage(res, 'danger', 'An error occurred', 'fa-solid fa-exclamation-circle', true);
        res.redirect(`/healthcarerecord/aallergies/${req.params.id}`);
    });
});


router.get("/viewallergy/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    // Find all record by its ID
    HealthcareAlg.findAll({
        attributes: ['alg_to', 'alg_date', 'alg_react','id'],
        where: {
            
            migrant_id4:id
        }
    }).then((results) => {
        res.render("institution/viewallergy", {
            results: results,
            id:id
        });
    }).catch((err) => console.log(err));
});

router.get("/editallergy/:id",ensureAuthenticated, (req, res) => {
    HealthcareAlg.findOne({
        attributes: ['alg_to', 'alg_date', 'alg_react','id'],
      where: {
        id: req.params.id
      }
    }).then((individual) => {
        
      res.render("institution/editallergy", {
        individual: individual
      });
    }).catch((err) => console.log(err));
  });

  router.put("/editAllergy/:id", (req, res) => {
    let errors = [];
    
    let alg_to = req.body.alg_to;
    let alg_date= req.body.alg_date;
    let alg_react = req.body.alg_react;

    if (errors.length > 0) {
        res.render("../../healthcarerecord/healthcarerecord"+ req.params.id, {
            errors,
            alg_to,
            alg_date,
            alg_react,
            
        })
    } else {
        HealthcareAlg.update({
            attributes: ['migrant_id4'],
            alg_to,
            alg_date,
            alg_react,
            
        }, {
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Allergy record successfully updated', 'fa-solid fa-square-plus', true);
            res.redirect('../../healthcarerecord/healthcarerecord');
        }).catch((err) => console.log(err))
    }
});

router.get("/deleteallergy/:id", ensureAuthenticated, (req, res) => {
    
    HealthcareAlg.findOne({
        attributes: ['migrant_id4'],
        where: {
            id: req.params.id
        }
    }).then((individual) => {
        

        HealthcareAlg.destroy({
            where: {
                id: req.params.id
            }
        }).then(() => {
            alertMessage(res, 'success', 'Allergy Record successfully Deleted', 'fa-solid fa-square-plus', true);
            res.redirect('../../healthcarerecord/viewallergy/'+ individual.migrant_id4);
        })
    })
});

//END ALLERGYRECORD -------------------------------------------------------------------------------------------------------------------------
//START BOOKINGS -------------------------------------------------------------------------------------------------------------------------

// router.get("/migrantbooking/:id", ensureAuthenticated, (req, res) => {
//     var walletAddress = req.session.wallet;
//     Individual.findOne({
//         where: {
//             wallet: walletAddress
//         }
//     }).then((individual) => {
//         var migrantname = individual.name
//         var migrantid = individual.id
//         res.render("institution/migrantbooking", {
//             name: individual.name,
//             id: individual.id
//         });
//     }).catch((err) => console.log(err));
// });

router.get("/migrantbooking", async (req, res) => {
    var walletAddress = req.session.wallet;
    // var walletAddress = "0x2c4723beaae2f9c540ba19951759d7e476bb2c70";
    var healthcareBook = await HealthcareBook.findAll({})
    Individual.findOne({
        where: {
            wallet: walletAddress
        }
    }).then((individual) => {
        var migrantname = individual.name
        var migrantid = individual.id
        res.render("institution/migrantbooking",{id:migrantid,migrantname,healthcareBook});
    }).catch((err) => console.log(err));
});

router.post("/migrantbooking", async (req, res) => {
    const searchName = req.body.searchName;
    let count = 0;

    var walletAddress = "0x2c4723beaae2f9c540ba19951759d7e476bb2c70";
    var individual = Individual.findOne({
        where: {
            wallet: walletAddress
        }
    })

    Entity.findAll({
        attributes: ['id','name', 'role'], 
        where: {
            name: {
                [Op.like]: `%${searchName}%`
            },
            role: 'Healthcare Institution'
        }
    }).then(async (entity) => {
        entity.forEach(() => {
            count++;
        });

        function getCurrentWeekDates() {
            var now = moment();
            var startOfWeek = now.clone().startOf('week');
            var endOfWeek = now.clone().endOf('week');
            var currentWeekDates = ["2022-01-01"];
            while (startOfWeek.isBefore(endOfWeek)) {
                currentWeekDates.push(startOfWeek.format('YYYY-MM-DD'));
                startOfWeek.add(1, 'day');
            }
            return currentWeekDates;
        };

        function saveBooking(instituteName, date, timeSlot) {
            var confirmation = "In Progress";
            HealthcareBook.create({
                book_date: date,
                book_institute: instituteName,
                book_slottime: timeSlot,
                confirmation: confirmation
            }).then((save) => {

                alert("Booking saved successfully!");
            }).catch((err) => console.log(err));
        };

        function showTimeSlots(instituteName, date) {
            var timeSlotsDiv = document.getElementById("timeSlots");
            timeSlotsDiv.innerHTML = "";
            for (var i = 0; i < availableTimeSlots.length; i++) {
                var timeSlot = availableTimeSlots[i];
                var timeSlotDiv = document.createElement("div");
                timeSlotDiv.innerHTML = timeSlot;
                timeSlotDiv.onclick = function() {
                    saveBooking(instituteName, date, timeSlot);
                };
                timeSlotsDiv.appendChild(timeSlotDiv);
            }
        };
        function showDatePicker(instituteName) {
            var datePicker = document.getElementById("datePicker");
            
            var startOfWeek = now.clone().startOf('week');
            var endOfWeek = now.clone().endOf('week');
            $("#datePicker").datepicker({
                minDate: startOfWeek.toDate(),
                maxDate: endOfWeek.toDate(),
                onSelect: function(date) {
                    showTimeSlots(instituteName, date);
                }
            });
        }
        var healthcareBook = await HealthcareBook.findAll({})
        
        var now = moment();
        var migrantid = individual.id;
        var availableTimeSlots = ["10.00am", "10.30am", "11.00am", "11.30am", "12.00pm", "12.30pm", "13.00pm"];
        var currentWeekDates = getCurrentWeekDates();
        var maxDate = currentWeekDates[1];
        var minDate = currentWeekDates[7];
        res.render("institution/migrantbooking", { entity,maxDate,minDate,healthcareBook,id:migrantid, availableTimeSlots, currentWeekDates, count, HealthcareBook, now });
    }).catch((err) => console.log(err));
});

router.get("/get/date/:date", async (req, res) => {
   var availableTimeSlots = ["10.00am", "10.30am", "11.00am", "11.30am", "12.00pm", "12.30pm", "13.00pm"];
   var arr = []
   let subCategory = await HealthcareBook.findAll({ where: {book_date: req.params.date} });
   
   selectedRows= availableTimeSlots.filter(function(cv){
     return !subCategory.find(function(e){
        return e.book_slottime == cv;
     });
   });

        res.send(selectedRows)
 })       

// router.post("/migrantbooking/:id", ensureAuthenticated, (req, res) => {
//     var walletAddress = req.session.wallet;
//     Individual.findOne({
//         where: {
//             wallet: walletAddress
//         }
//     }).then((individual) => {
//         var migrantname = individual.name
//         var migrantid = individual.id
//         const hospitals = ["Sengkang Hospital", "Khoo Teck Puat Hospital", "Healthserve Community Clinic", "St Andrew Clinic"];
//         let searchName = req.body.searchName;
//         let matchingHospital;
//         if (searchName) {
//         matchingHospital = hospitals.find(hospital => hospital.toLowerCase() === searchName.toLowerCase());
//         }
        
//         if (matchingHospital) {
//             HealthcareBook.findAll({
//                 where: {
//                     book_institute: matchingHospital,
//                     book_date: {
//                         [Op.gte]: new Date()
//                     },
//                     confirmation: 'available'
//                 }
//             }).then(booking => {
//                 let availableBooking = booking.map(b => b.book_date)
//                 let availableTimeSlot = ["10.00am", "10.30am", "11.00am", "11.30am", "12.00pm", "12.30pm", "13.00pm"]
//                 res.render('institution/migrantbooking', {
//                     name: individual.name,
//                     id: individual.id,
//                     matchingHospital: matchingHospital,
//                     availableBooking: availableBooking,
//                     availableTimeSlot: availableTimeSlot
//                 });
//             }).catch(err => {
//                 console.log(err);
//             });
//         } else {
//             res.render('institution/migrantbooking', {
//                 name: individual.name,
//                 id: individual.id,
//                 message: "No matching hospital found"
//             });
//         }
//     }).catch((err) => console.log(err));
// });


// booking now route
router.post('/book-now', (req, res) => {
    let book_date = req.body.book_date;
    let book_slottime = req.body.book_slottime;
    let book_institute = req.body.book_institute;
        HealthcareBook.create({
            book_date: book_date,
            book_institute:book_institute,
            book_slottime: book_slottime,
            confirmation: 'in-progress'
        }).then(() => {
            res.redirect(`/healthcarerecord/migrantbooking`)
            // res.redirect(`/healthcarerecord/migrantbooking/${req.params.id}`)
        }).catch(err => {
            console.log(err);
        });
});

// Confirm booking route
router.post('/confirm/:id', (req, res) => {
    let book_date = req.body.book_date;
    let book_slottime = req.body.book_slottime;
    let confirm = req.body.confirm;

    if (confirm === "yes") {
        HealthcareBook.create({
            book_date: book_date,
            book_slottime: book_slottime,
            confirmation: 'in-progress'
        }).then(() => {
            res.redirect('/dashboard');
        }).catch(err => {
            console.log(err);
        });
    } else {
        res.redirect('../institution/migranthealth/:id');
    }
});



module.exports = router;