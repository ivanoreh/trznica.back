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
	
	app.options('*', function(req, res) {
		res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
		res.send(200);

	});
	
	// Views
	app.get('/', routes.views.index);

	app.get('/api/products', function(req, res){
		try{
			keystone.list('Product').model.find().exec(function(err, products){
				if(err){
					res.send({status: "NOT OK"});
				}
				else{
					res.send(products);
				}
			})
		} catch(e){
			console.log(e);
		}
	});


	app.get('/api/product/:id', function(req, res){
		try{
			keystone.list('Product').model.find().where('_id', req.params.id).exec(function(err, products){
				if(err){
					res.send({status: "NOT OK"});
				}
				else{
					res.send(products);
				}
			})
		} catch(e){
			console.log(e);
		}
	});


	app.get('/customer/validate/:id', function(req, res){
		try{
			keystone.list('Customer').model.findOneAndUpdate(
				{'_id': req.params.id},
				{validated: true},
				function(err){
					if(err){
						res.send({status: "NOT OK"});
					}
					else{
						res.redirect(301, "http://bosso.lu/shop7.html"); // TODO
						console.log("customer", req.params.id, "validated!")
					}
				}
			);
		} catch(e){
			console.log(e);
		}
	});

	app.get('/api/reviews/:pid', function(req, res){
		try{
			keystone.list('Review').model.find().where('product', req.params.pid).exec(function(err, reviews){
				if(err){
					console.log("reviews  err", err);
					res.send({status: "NOT OK"});
				}
				else{
					console.log("reviews", reviews);
					res.send(reviews);
				}
			})
		} catch(e){
			console.log(e);
		}
	});

	//=========POST============//

	const crypto = require('crypto');
	const secret = 'abosso!@34BamB;K';

	app.post('/review/', function(req, res){
		try{
			//console.log(req.body.email, req.body.password);
			//create new user
			var email = req.body.email;
			var name = req.body.name;
			var rating = req.body.rating;
			var review = req.body.review;
			var pid = req.body.product;
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass, name, rating, review, pid);

			var Customers = keystone.list('Customer');
			Customers.model.find().where('email', email)
				.where('password', pass)
				.where('validated', true)
				.exec(function(err, customer){
					console.log("err", err);
					console.log("customer", customer);
					if(err || customer == undefined || customer == null){
						console.log("NOT OK 1")
						res.send({status: "NOT OK"});
						return;
					}
					if(customer.length == 0){
						console.log("NOT OK 2")
						res.send({status: "NOT OK"});
						return;
					}
					if(customer[0].purchased.length == 0 || !valueInArray(customer[0].purchased, pid)){
						console.log("BUY FIRST", customer[0].purchased);
						res.send({status: "BUY FIRST"});
						return;
					}

					var Reviews = keystone.list('Review');
					var newReview = new Reviews.model({
						email: email,
						name: name,
						rating: rating,
						review_text: review,
						product: pid
					});

					newReview.save(function(err){
						if(err){
							console.log("new review save err", err);
							res.send({status: "NOT OK"});
							return;
						}
						else{
							res.send({status: "OK"});
						}
					});
				});
		} catch(e){
			console.log("user login review err", e);
			res.send({redirect_url: "http://bosso.lu"});
		}
	});

	app.post('/customer/login/', function(req, res){
		try{
			//console.log(req.body.email, req.body.password);
			//create new user
			var email = req.body.email;
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass);

			var Customers = keystone.list('Customer');
			Customers.model.find().where('email', email)
				.where('password', pass)
				.where('validated', true)
				.exec(function(err, customer){
					try {
						if (err || customer == null || customer == undefined || customer.length == 0) {
							console.log("login err", err, customer);
							res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
							return;
						}
						if (customer.length > 0) {
							console.log(customer, "logged in successfuly");
							//var minute = 220 * 3030;
							//res.cookie("login", customer._id, {maxAge: minute});
							res.send({redirect_url: "http://bosso.lu/orders.html", status: "OK"});
						}
						else{
							res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
						}
					} catch(e){
						console.log(e);
						res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
						return;
					}
				});
		} catch(e){
			console.log("user login err", e);
			res.send({redirect_url: "http://bosso.lu"});
		}
	});

	app.post('/customer/orders/', function(req, res){
		try{
			var email = req.body.email;
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass);

			var Customers = keystone.list('Customer');
			Customers.model.find().where('email', email)
				.where('password', pass)
				.where('validated', true)
				.exec(function(err, customer){
					try {
						if (err || customer == null || customer == undefined || customer.length == 0) {
							console.log("login err", err, customer);
							res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
							return;
						}
						if (customer.length > 0) {
							//console.log(customer, "logged in successfuly");
							//var minute = 220 * 3030;
							//res.cookie("login", customer._id, {maxAge: minute});
							keystone.list('Order').model.find().where('buyer', customer[0]._id).exec(
								function(err, orders){
									if(err){
										res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
									}
									else{
										console.log("customer orders:", orders);
										res.send(orders);
									}
								}
							)
						}
						else{
							res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
						}
					} catch(e){
						console.log(e);
						res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
						return;
					}
				});
		} catch(e){
			console.log("user login err", e);
			res.send({redirect_url: "http://bosso.lu"});
		}
	});

	app.post('/customer/wishlist/', function(req, res){
		try{
			var email = req.body.email;
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass);

			var Customers = keystone.list('Customer');
			Customers.model.find().where('email', email)
				.where('password', pass)
				.where('validated', true)
				.exec(function(err, customer){
					try {
						if (err || customer == null || customer == undefined || customer.length == 0) {
							console.log("login err", err, customer);
							res.send([]);
							return;
						}
						if (customer.length > 0) {
							res.send(customer[0].wishlist);
						}
						else{
							res.send([]);
						}
					} catch(e){
						console.log(e);
						res.send([]);
						return;
					}
				});
		} catch(e){
			console.log("user login err", e);
			res.send([]);
		}
	});

	app.post('/customer/add/wishlist/', function(req, res){
		try{
			var email = req.body.email;
			var pid = req.body.id;
			var pid = req.body.id;
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass);

			var Customers = keystone.list('Customer');
			Customers.model.findOneAndUpdate(
				{email: email, password: pass, validated: true},
				{$addToSet: {wishlist: pid}},
				function(err){
					if(err) {
						console.log("wishlist add error", err);
						res.send("NOT OK");
					}
					else res.send("OK");
					console.log("return OK");
				}
			);
		} catch(e){
			console.log("user login err", e);
			res.send([]);
		}
	});

	app.post('/customer/remove/wishlist/', function(req, res){
		try{
			var email = req.body.email;
			var pid = req.body.id;
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass);

			var Customers = keystone.list('Customer');
			Customers.model.findOneAndUpdate(
				{email: email, password: pass, validated: true},
				{$pull: {wishlist: pid}},
				function(err){
					if(err) {
						console.log("wishlist remove error", err);
						res.send("NOT OK");
					}
					else res.send("OK");
				}
			);
		} catch(e){
			console.log("user login err", e);
			res.send([]);
		}
	});

	app.post('/customer/info/', function(req, res){
		try{
			var email = req.body.email;
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass);

			var Customers = keystone.list('Customer');
			Customers.model.find().where('email', email)
				.where('password', pass)
				.where('validated', true)
				.exec(function(err, customer){
					try {
						if (err || customer == null || customer == undefined || customer.length == 0) {
							console.log("login err", err, customer);
							res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
							return;
						}
						if (customer.length > 0) {
							//console.log(customer, "logged in successfuly");
							//var minute = 220 * 3030;
							//res.cookie("login", customer._id, {maxAge: minute});
							res.send(customer);
						}
						else{
							res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
						}
					} catch(e){
						console.log(e);
						res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
						return;
					}
				});
		} catch(e){
			console.log("user login err", e);
			res.send({redirect_url: "http://bosso.lu"});
		}
	});

	app.post('/customer/register/', function(req, res){
		try{
			//create new user

			var email = req.body.email;
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass);

			var Customers = keystone.list('Customer');
			var newCustomer = new Customers.model({
				email: email,
				password: pass,
				validated: true
			});
			newCustomer.save(function(err, customer){
				try {
					console.log("customer created", customer);
					if (err) {
						console.log("creating customer error", err);
						res.send({redirect_url: "http://bosso.lu/login.html"}); //TODO url to login
					}
					else {/*
						app.mailer.send('email', {
							to: 'ivan.oreh@hotmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
							subject: 'Test Email', // REQUIRED.
							otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
						}, function (err) {
							if (err) {
								// handle error
								console.log(err);
								res.redirect(301, "http://bosso.lu"); //TODO url to login
								return;
							}
							res.redirect(301, "http://bosso.lu/shop7.html"); //TODO new page -> check your email
						});*/

						res.send({redirect_url: "http://hrkify.ivanorehovec.info:3030/customer/validate/" + customer._id});
					}
				} catch(eror){
					console.log("eror", eror);
					res.send({redirect_url: "http://bosso.lu/login.html"});//TODO url to login
				}
			})

		} catch(e){
			console.log("user register err", e);
			res.send({redirect_url: "http://bosso.lu/login.html"});
		}
	});


	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	var paypal = require('paypal-rest-sdk');
	paypal.configure({
		'mode': 'sandbox', //sandbox or live
		'client_id': 'ARrYgIbUx1eV84zOPiUzI0SDUmxFdfGsoiGw-v5jq-v7dhfHoVGrrFMywyW3IKYwyhIOv4Imq3eQdn3E',
		'client_secret': 'EMlBxqkwPgLqQSCOQlrvC-qNv2sVeCg1hMruo-x6moeUi-yScSy7ROZxFHQCQsp4AGFQBDBxcszh8RtK'
	});

	app.get('/paypal/confirm', function(req, res){
		try{
			var execute_payment_details = { "payer_id": req.query.PayerID };
			paypal.payment.execute(
				req.query.paymentId,
				execute_payment_details,
				function(error, payment){
					if(error){
						console.error(error);
						paypal.generate_token(function(error, token){
							if(error){
								console.error(error);
							} else {
								paypal.payment.execute(
									req.query.paymentId,
									execute_payment_details,
									function(error, payment){
										if(error){
											console.log(error);
										} else {
											console.log(payment);
											//spremi order u odnosu na paymentId
											keystone.list('Order').model.findOneAndUpdate(
												{paypal_id: req.query.paymentId},
												{executed: true, timeExecuted: Date.now()},
												function(err, order){
													if(err){
														console.log("updating order after exec error");
													}

													try{
														var details = JSON.parse(order.details);
														var products = details.products;
														var ids = [];
														for(var i = 0; i < products.length; ++i){
															ids.push({id:products[i].id, quantity:products[i].quantity});
														}

														keystone.list('Customer').model.findOneAndUpdate(
															{email: details.email},
															{
																$addToSet : {orders: order._id}
															},
															function(err){
																if(err){
																	console.log("adding order to customer", err);
																}
															}
														);

														//Probably unnecessary
														for(var k = 0 ; k < ids.length; ++k) {
															new function() {
																keystone.list('Customer').model.findOneAndUpdate(
																	{email: details.email},
																	{
																		$addToSet: {purchased: ids[k].id}
																	},
																	function (err, succ) {
																		if (err) {
																			console.log("adding to set bought products" + k, err);
																		}
																	}
																);
																keystone.list('Product').model.findOneAndUpdate(
																	{_id: ids[k].id},
																	{
																		$inc: {purchased: ids[k].quantity}
																	},
																	function (err, succ) {
																		if (err) {
																			console.log("inc err product " + k, err);
																		}
																	}
																);
															};
														}
													} catch(e){
														console.log("saving bought items err2", e);
													}
												}
											)
										}
									}
								);
							}
						});
					} else {
						console.log("Uspjesno izvrseno placanje");
						//spremi order u odnosu na paymentId
						keystone.list('Order').model.findOneAndUpdate(
							{paypal_id: req.query.paymentId},
							{executed: true, timeExecuted: Date.now()},
							function(err, order){
								if(err){
									console.log("updating order after exec error");
								}

								try{
									var details = JSON.parse(order.details);
									var products = details.products;
									var ids = [];
									for(var i = 0; i < products.length; ++i){
										ids.push({id:products[i].id, quantity:products[i].quantity});
									}
									console.log("ids", ids);

									keystone.list('Customer').model.findOneAndUpdate(
										{email: details.email},
										{
											$addToSet : {orders: order._id}
										},
										function(err){
											if(err){
												console.log("adding order to customer", err);
											}
										}
									);


									for(var k = 0 ; k < ids.length; ++k) {
										new function() {
											keystone.list('Customer').model.findOneAndUpdate(
												{email: details.email},
												{
													$addToSet: {purchased: ids[k].id}
												},
												function (err, succ) {
													if (err) {
														console.log("adding to set bought products" + k, err);
													}
												}
											);
											keystone.list('Product').model.findOneAndUpdate(
												{_id: ids[k].id},
												{
													$inc: {purchased: ids[k].quantity}
												},
												function (err, succ) {
													if (err) {
														console.log("inc err product " + k, err);
													}
												}
											);
										};
									}
								} catch(e){
									console.log("saving bought items err", e);
								}
							}
						)

					}
				}
			);
			res.redirect(301, "http://bosso.lu/thank_you.html");
		}catch(e){
			console.log(e);
			res.redirect(301, "http://bosso.lu/thank_you.html");
		}
	});
	app.post('/paypal/order', function(req, res){
		try {
			//validate order
			console.log(req.body);
			var amount = parseFloat(req.body.amount);
			var products = req.body.products;
			var country = req.body.country;
			var firstName = req.body.firstName;
			var lastName = req.body.lastName;
			var company = req.body.companyName;
			var address = req.body.address;
			var addressSuite = req.body.addressSuite;
			var city = req.body.city;
			var postCode = req.body.postCode;
			var phone = req.body.phone;
			var zupanija = req.body.zupanija;

			var email = req.body.email;
			console.log(email, req.body);
			var pass = crypto.createHmac('sha256', secret)
				.update(req.body.password)
				.digest('hex');
			console.log(email, pass);

			var Customers = keystone.list('Customer');
			Customers.model.find().where('email', email)
				.where('password', pass)
				.where('validated', true)
				.exec(function(err, customer){
					try {
						if (err || customer == null || customer == undefined || customer.length == 0) {
							console.log("login err", err, customer);
							res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
							return;
						}
						if (customer.length > 0) {
							if(amount < 0 || products == undefined || products == null){
								console.log("amount < 0");
								res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
								return;
							}

							var description = {
								country: country,
								phone: phone,
								postCode: postCode,
								firstName: firstName,
								lastName: lastName,
								address: address,
								addressSuite: addressSuite,
								company: company,
								city: city,
								zupanija: zupanija
							};
							if(customer[0].country == undefined || customer[0].country == null){
								Customers.model.findOneAndUpdate(
									{email: email, password: pass, validated: true},
									description,
									function(err){
										console.log("update customer err", err);
									}
								)
							}

							paypal.generate_token(function(error, token){
								if(error){
									console.error(error);
								} else {
									//console.log(token);
								}
							});

							var payment_details = {
								"intent": "sale",
								"redirect_urls":{
									"return_url":"http://hrkify.ivanorehovec.info:3030/paypal/confirm", //TODO Change in production
									"cancel_url":"http://bosso.lu"
								},
								"payer": {
									"payment_method": "paypal"
								},
								"transactions": [{
									"amount": {
										"total": amount,
										"currency": "USD",
										"details": {
											"subtotal": amount ,
											"shipping": "0.00"}
									},
									"description": "You ordered: " + JSON.stringify(products)  + " with info: " + description + "and email: " + email
								}]
							};


							paypal.payment.create(payment_details, function(error, payment){
								if(error){
									console.error(error);

									paypal.generate_token(function(error, token){
										if(error){
											console.error(error);
											res.send({redirect_url: "http://paypal.com"});
										} else {
											// save order
											var paypalId = payment.id;
											var customerId = "573278ae6181715a3b3ff0dd";
											var price = amount;
											var details = JSON.stringify(
													{
														products: products,
														description: description,
														email: email
													}
												);

											var Orders = keystone.list('Order');
											var newOrder = new Orders.model({
												paypal_id: paypalId,
												buyer : customer[0]._id,
												price: price,
												details: details
											});

											console.log("paypalID", paypalId);
											console.log("cID", customer[0]._id);
											console.log("price", price);
											console.log("details", details);

											newOrder.save(function(err, order){
												if(err) {
													console.log("order saving error", err);
												}
												else{
													console.log(order);
													//add order to buyer-s acc
													keystone.list('Customer').model.findOneAndUpdate(
														{_id: customerId},
														{$addToSet: {orders: order._id}},
														function(er){
															if(er){
																console.log("error when adding order to user acc", er);
															}
														}
													);
												}
											});

											var redirect_link = "";
											for(var i = 0; i < payment.links.length; ++i){
												if(payment.links[i].rel == "approval_url"){
													redirect_link = payment.links[i].href;
													break;
												}
											}
											res.send({redirect_url: redirect_link});
										}
									});
								} else {
									// save order
									var paypalId = payment.id;
									var customerId = "573278ae6181715a3b3ff0dd";
									var price = amount;
									var details = JSON.stringify(
										{
											products: products,
											description: description,
											email: email
										}
									);

									var Orders = keystone.list('Order');
									var newOrder = new Orders.model({
										paypal_id: paypalId,
										buyer : customer[0]._id,
										price: price,
										details: details
									});
									console.log("paypalID", paypalId);
									console.log("cID", customer[0]._id);
									console.log("price", price);
									console.log("details", details);

									newOrder.save(function(err, order){
										if(err) {
											console.log("order saving error", err);
										}
										else{
											console.log(order);
											//add order to buyer-s acc
											keystone.list('Customer').model.findOneAndUpdate(
												{_id: customerId},
												{$addToSet: {orders: order._id}},
												function(er){
													if(er){
														console.log("error when adding order to user acc", er);
													}
												}
											);
										}
									});

									var redirect_link = "";
									for(var i = 0; i < payment.links.length; ++i){
										if(payment.links[i].rel == "approval_url"){
											redirect_link = payment.links[i].href;
											break;
										}
									}
									res.send({redirect_url: redirect_link});
								}
							});

						}
						else{
							res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
						}
					} catch(e){
						console.log(e);
						res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
						return;
					}
				});

		} catch(e){
			console.log("wrong request content", req.body, e);
			res.send({redirect_url: "http://bosso.lu/login.html?alert=wrongCreds"});
			return;
		}

	});
};

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
