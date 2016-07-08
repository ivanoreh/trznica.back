/**
 * Created by ivanoreh on 4/13/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Model
 * ==========
 */

var Category = new keystone.List('Category', {
	autokey: {path: 'category', from: 'ime', unique: true},
	track: true,
	map: {name: "ime"},
	defaultSort: '-createdAt',
	//nodelete: true
});

Category.add({
	ime: {type: Types.Text, default: "", required: true, initial: true },
	nadkat: {type: Types.Relationship, ref: "Category", default: null, initial: true}
});



/**
 * Registration
 */

Category.defaultColumns = 'ime, nadkat';
Category.register();
