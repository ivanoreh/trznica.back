/**
 * Created by ivanoreh on 4/13/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Model
 * ==========
 */

var Certificate = new keystone.List('Certificate', {
	autokey: {path: 'certificate', from: 'ime', unique: true},
	track: true,
	defaultSort: '-createdAt',
	//nodelete: true
});

Certificate.add({
	ime: {type: Types.Text, default: "", required: true, initial: true },
	opis: {type: Types.Text, default: ""},
	slika: {type: Types.CloudinaryImage}
});


/**
 * Registration
 */

Certificate.defaultColumns = 'ime, nadkat';
Certificate.register();
