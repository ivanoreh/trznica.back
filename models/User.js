var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
	track: true, 
	noedit: true
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	isProtected: { type: Boolean, noedit: true, hidden: true }, 
	canDelete: {type: Boolean, noedit: true, hidden: true, default: false}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


//user protection start
function protect (path) {
	var user = this;
	User.schema.path(path).set(function (value) {
		return (user.isProtected) ? user.get(path) : value;
	});
}

['name.first', 'name.last', 'email'].forEach(protect);

User.schema.path('password').set(function (value) {
	return (this.isProtected) ? '$2a$10$b4vkksMQaQwKKlSQSfxRwO/9JI7Fclw6SKMv92qfaNJB9PlclaONK' : value;
});

//user protection end

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
