/**
 * Created by ivanoreh on 4/13/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Model
 * ==========
 */

var Racun = new keystone.List('Racun', {
	autokey: {path: 'racun', from: ' proizvod, kolicina, cijena, datum', unique: true},
	track: true,
	defaultSort: '-createdAt',
	//nodelete: true
});

Racun.add({
	sifra: {type: Types.Text, default: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)},
	proizvod: {type: Types.Relationship, ref: "Product", required: true, initial: true},
	kolicina: {type: Types.Number, default: 1, required: true, initial: true},
	cijena: {type: Types.Number, default: 10, format: '0,0.00kn', required: true, initial: true},
	datum: {type: Types.Datetime, default: Date.now()},
	opaska: {type: Types.Text, default: ""}
});


/**
 * Registration
 */

Racun.defaultColumns = 'vlasnik, proizvod, kolicina, cijena, datum';
Racun.register();
