/*
* 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
* in this JS file.
* */
const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');
const MySQLStore = require('express-mysql-session');
const handlebars = require('handlebars');
const db = require('./config/db');
const moment = require('moment');
const HealthcareBook= require("./models/HealthcareBook");

//const passport = require('passport');

/*
* Loads routes file main.js in routes directory. The main.js determines which function
* will be called based on the HTTP request and URL.
*/
const mainRoute = require('./routes/main');
const adminRoute = require('./routes/admin');
const healthcarerecordRoute = require('./routes/healthcarerecord');
const {formatDate, radioCheck, replaceCommas,
checkDeactivated, checkActivated, checkRole,} = require('./helpers/hbs');

/*
* Creates an Express server - Express is a web application framework for creating web applications
* in Node JS.
*/
const app = express();
const vidjtDB = require('./config/DBConnection');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
vidjtDB.setUpDB(false);

// Passport config
//const authenticate = require('./config/passport');
//authenticate.localStrategy(passport);

// Handlebars Middleware
/*
* 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
* from Node JS.
*
* 2. Node JS will look at Handlebars files under the views directory
*
* 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
*
* */
app.engine('handlebars', exphbs({
	helpers: {
		formatDate: formatDate,
		radioCheck: radioCheck,
		replaceCommas: replaceCommas,
		checkDeactivated: checkDeactivated,
		checkActivated: checkActivated,
		checkRole: checkRole,
		
		eq:function(arg1, arg2){return arg1 === arg2;},
		unique: function(context, options){let ret = "";
		let uniqueFamRelationships = new Set();
	
		for (let i = 0, j = context.length; i < j; i++) {
			let fam = context[i];
	
			if (!uniqueFamRelationships.has(fam.fam_relationship)) {
				uniqueFamRelationships.add(fam.fam_relationship);
				ret = ret + options.fn(fam);
			} else {
				ret = ret + options.inverse(fam);
			}
		}
		return ret;
	},

		forEach: function(results, fam_relationship, options){
			var out = "";
    		var previousRelationship;

    		for (var i = 0; i < results.length; i++) 
				{
        			var currentRelationship = results[i].fam_relationship;
        			if (currentRelationship === fam_relationship) 
					{
            			if (currentRelationship !== previousRelationship) {
                		out += "<div class='card-header'>" + currentRelationship + "</div>";
            			}
            			out += options.fn(results[i]);
            			previousRelationship = currentRelationship;
        			}
    			}

   			 return out;
		},


		split:function(med_provided){
			var t = med_provided.split(",");
			return new handlebars.SafeString(t.join(" <br/> <br/>"));
	  },
	  getCurrentWeekDates:function() {
		var now = moment();
		var startOfWeek = now.clone().startOf('week');
		var endOfWeek = now.clone().endOf('week');
		var currentWeekDates = ["2022-01-01"];
		while (startOfWeek.isBefore(endOfWeek)) {
			currentWeekDates.push(startOfWeek.format('YYYY-MM-DD'));
			startOfWeek.add(1, 'day');
		}
		return currentWeekDates;
	},

	saveBooking:function(instituteName, date, timeSlot) {
		var confirmation = "In Progress";
		HealthcareBook.create({
			book_date: date,
			book_institute: instituteName,
			book_slottime: timeSlot,
			confirmation: confirmation
		}).then(() => {
			alert("Booking saved successfully!");
		}).catch((err) => console.log(err));
	},

	showTimeSlots:function(instituteName, date) {
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
	},
	showDatePicker:function(instituteName) {
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
	},

	  
		
	},
	
	defaultLayout: 'main', // Specify default template views/layout/main.handlebar 

}));
app.set('view engine', 'handlebars');

// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride('_method'));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(session({
	key: 'vidjot_session',
	secret: 'tojiv',
	store: new MySQLStore({
		host: db.host,
		port: 3306,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,
		checkExpirationInterval: 900000,
		expiration: 900000,
	}),
	resave: false,
	saveUninitialized: false,
}));

//app.use(passport.initialize());
//app.use(passport.session());

app.use(flash());
app.use(FlashMessenger.middleware);
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// Place to define global variables - not used in practical 1
app.use(function (req, res, next) {
	next();
});

// Use Routes
/*
* Defines that any root URL with '/' that Node JS receives request from, for eg. http://localhost:5000/, will be handled by
* mainRoute which was defined earlier to point to routes/main.js
* */
app.use('/', mainRoute); // mainRoute is declared to point to routes/main.js
app.use('/admin', adminRoute);
app.use('/healthcarerecord', healthcarerecordRoute);

// This route maps the root URL to any path defined in main.js

/*
* Creates a unknown port 5000 for express server since we don't want our app to clash with well known
* ports such as 80 or 8080.
* */
const port = 5000;

// Starts the server and listen to port 5000
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});