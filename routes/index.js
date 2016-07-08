/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var cors = require('cors');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);



// Import Route Controllers

keystone.set('404', function(req, res, next) {
    res.notfound();
});
 
// Handle other errors
keystone.set('500', function(err, req, res, next) {
    var title, message;
    if (err instanceof Error) {
        message = err.message;
        err = err.stack;
    }
    res.err(err, title, message);
});


var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	var cookieParser = require('cookie-parser');
	app.use(cookieParser('SecretTokenTrznica!@34'));

	app.all('*', keystone.middleware.cors);
	/*
	 app.all('*', function(req, res, next){
	 res.header("Expires", "-1");
	 res.header("Cache-Control", "no-cache, no-store, private");
	 next();
	 });*/

	//app(cors());

	app.options('*', function (req, res) {
		res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
		res.send(200);

	});

	// Views
	app.get('/', routes.views.index);

	app.get('/products', function (req, res) {
		try {
			keystone.list('Product').model.find().exec(function (err, products) {
				if (err) {
					res.send({status: "NOT OK"});
				}
				else {
					res.send(products);
				}
			})
		} catch (e) {
			console.log(e);
		}
	});

	app.get('/product/:pid', function (req, res) {
		try {
			keystone.list('Product').model.find().where("_id", req.params.pid).exec(function (err, products) {
				if (err) {
					res.send({status: "NOT OK"});
				}
				else {
					res.send(products);
				}
			})
		} catch (e) {
			console.log(e);
		}
	});

	app.get('/owner/:oid', function (req, res) {
		try {
			keystone.list('User').model.find().where("_id", req.params.oid)
				.select('_id name').exec(function (err, owners) {
				if (err || owners == undefined || owners.length == 0) {
					res.send({status: "NOT OK"});
				}
				else {
					var ret ={};
					ret["vlasnik"] = owners[0];

					keystone.list('Product').model.find().where("vlasnik", req.params.oid).exec(function (err, products) {
						if (err) {
							res.send(ret);
						}
						else {
							ret["products"] = products;
							keystone.list('Najam').model.find().where("vlasnik", req.params.oid).exec(function (err, najams) {
								if (err) {
									res.send({status: "NOT OK"});
								}
								else {
									ret["najmovi"] = najams;
									res.send(ret);
								}
							})
						}
					})
				}
			})
		} catch (e) {
			console.log(e);
		}
	});

	app.get('/objekt/:oid', function (req, res) {
		try {
			keystone.list('Objekt').model.find().where('_id', req.params.oid).exec(function (err, objekti) {
				if (err) {
					res.send({status: "NOT OK"});
				}
				else {
					res.send(objekti);
				}
			})
		} catch (e) {
			console.log(e);
		}
	});

	app.get('/certificate/:cid', function (req, res) {
		try {
			keystone.list('Certificate').model.find().where('_id', req.params.pid).exec(function (err, objekti) {
				if (err) {
					res.send({status: "NOT OK"});
				}
				else {
					res.send(objekti);
				}
			})
		} catch (e) {
			console.log(e);
		}
	});

	app.get('/certificate/:cid', function (req, res) {
		try {
			keystone.list('Certificate').model.find().where('_id', req.params.pid).exec(function (err, objekti) {
				if (err) {
					res.send({status: "NOT OK"});
				}
				else {
					res.send(objekti);
				}
			})
		} catch (e) {
			console.log(e);
		}
	});


	app.get('/category/:cid', function (req, res) {
		try {
			keystone.list('Category').model.find().where('_id', req.params.cid).exec(function (err, category) {
				if (err) {
					res.send({status: "NOT OK"});
				}
				else {
					res.send(category);
				}
			})
		} catch (e) {
			console.log(e);
		}
	});

	app.get('/racuni', function (req, res) {
		try {
			keystone.list('Racun').model.find().exec(function (err, category) {
				if (err) {
					res.send({status: "NOT OK"});
				}
				else {
					res.send(category);
				}
			})
		} catch (e) {
			console.log(e);
		}
	});

	app.get('/users', function (req, res) {
		try {
			keystone.list('User').model.find().exec(function (err, users) {
				if (err) {
					res.send({status: "NOT OK"});
				}
				else {
					res.send(users);
				}
			})
		} catch (e) {
			console.log(e);
		}
	});


}

function valueInArray(arr, val) {
	//console.log("via\n", arr, val, "\n", arr[0] == val.toString());
	try {
		val = val.toString();
	} catch (e) {
	}

	for (var i = 0; i < arr.length; ++i) {
		console.log(val, arr[i], val == arr[i]);
		if (arr[i] == val)
			return true;
	}
	return false;
}
