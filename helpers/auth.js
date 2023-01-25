const alertMessage = require('../helpers/messenger');

const ensureAuthenticated = (req, res, next) => {
    if(req.session.wallet != null) {
        return next(); // calling next() to proceed to the next statement
    }
    // if not authenticated, show alert message and redirect to '/'
    alertMessage(res, 'danger', 'Access Denied', 'fas fa-exclamation-circle', true);
    res.redirect("/");
};

module.exports = ensureAuthenticated;