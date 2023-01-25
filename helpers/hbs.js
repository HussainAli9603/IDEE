const moment = require('moment');
module.exports = {    
    formatDate: function(date, targetFormat) {
        return moment(date).format(targetFormat);
    },
    radioCheck: function(value, radioValue) {
        if (value === radioValue) {
            return 'checked';
        }
        return '';
    },
    replaceCommas: function(str) {
        if (str != null || str.length !== 0) {
            if (str.trim().length !== 0) {
                return str.replace(/,/g, ' | ');
            }
        }
        return 'None';
    },

    // Brian's helpers
    checkDeactivated: function(value) {
        if (value == 4) {
            return 'display: block';
        }
        return 'display: none';
    },
    checkActivated: function(value) {
        if (value == 3) {
            return 'display: block';
        }
        return 'display: none';
    },
    checkRole: function(value) {
        if (value == 'Business') {
            return 'color: #F8A72D;'
        }
        return 'color: #5CCFFE;'
    }
};