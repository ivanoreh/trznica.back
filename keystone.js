// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'KC Trznica', // mijenjanje naziva stvara novu bazu (ova ostaje sacuvana)
	'brand': 'trznica.kc',
	
	//'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',
	
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',

	'wysiwyg menubar': true,
	'wysiwyg skin': 'lightgray',
	'wysiwyg additional buttons': 'searchreplace visualchars,'

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('cloudinary config', { cloud_name: 'djtgwbbgf', api_key: '645424393544455', api_secret: '_46aZMTAIub7Wj3jew1qTUMIzUI' });
// optional, will prefix all built-in tags with 'keystone_'
keystone.set('cloudinary prefix', 'keystone');
  
// optional, will prefix each image public_id with [{prefix}]/{list.path}/{field.path}/
keystone.set('cloudinary folders', true);


// GOOGLE Maps API
// used for location fields
keystone.set('google api key', 'AIzaSyCo58eGQaaKM83_Ae2As_-opDuj4geUOEI');
keystone.set('google server api key', 'AIzaSyBZmRApnBo5ZXB1kLzXVWePSJgXQ2ySkuk');
keystone.set('default region', 'HR'); // optional limit location queries to HR

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

keystone.set('cors allow origin', true);

keystone.set('access control allow origin', true);
//keystone.set('cors allow methods', true);
keystone.set('cors allow headers', true);


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'korisnici': 'users',
	'objekti': 'objekts',
	'proizvodi': 'products',
	'kategorije': 'categories',
	'racuni': 'racuns',
	'certifikati': 'certificates',
	'najmovi': 'najams'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();

var keystone = require('keystone'),
	async = require('async'),
	User = keystone.list('User');

var admins = [
	{
		email: 'trznica@komunalac.kc',
		password: 'adminasdf',
		name: { first: 'Ivan', last: 'Admin' }
	}
];

function createAdmin(admin, done) {
	User.model.find()
		.where('name.first', admin.name.first)
		.where('name.last', admin.name.last)
		.where('email', admin.email)
		.exec(function(err, users){
			if(users.length == 0){
				var newAdmin = new User.model(admin);

				newAdmin.isAdmin = true;
				if(admin.name.last == "Admin")
					newAdmin.canDelete = true;
				
				newAdmin.save(function(err) {
					if (err) {
						console.error("Error adding admin " + admin.email + " to the database:");
						console.error(err);
					} else {
						console.log("Added admin " + admin.email + " to the database.");
					}
					done(err);
				});
			}
		});
}

async.forEach(admins, createAdmin);

