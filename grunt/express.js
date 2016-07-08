module.exports = {
	options: {
		port: 3030,
		//middleware: function (connect) {
		//	return [
		//		function(req, res, next) {
		//			res.setHeader('Access-Control-Allow-Origin', '*');
		//			res.setHeader('Access-Control-Allow-Methods', '*');
		//			res.setHeader('Access-Control-Allow-Headers', 'x-requested-with ');
		//			next();
		//		},
		//	];
		//}
	},
	dev: {
		options: {
			script: 'keystone.js',
			debug: true
		}
	}
}
