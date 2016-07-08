/**
 * Created by ivanoreh on 4/13/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Model
 * ==========
 */

var Objekt = new keystone.List('Objekt', {
	autokey: {path: 'objekt', from: 'selektor', unique: true},
	track: true,
	map: {name: 'selektor'},
	defaultSort: '-createdAt',
	//nodelete: true
});

Objekt.add({
	tip : {type: Types.Select, options: "stol, štand, kiosk, prostorija, spremiste,  ostalo", default: "ostalo", initial: true},
	selektor: {type: Types.Text, initial: true, required: true}
});


/**
 * Registration
 */

Objekt.defaultColumns = 'selektor, tip';
Objekt.register();
