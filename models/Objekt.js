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
	defaultSort: '-createdAt',
	//nodelete: true
});

Objekt.add({
	selektor: {type: Types.Text, initial: true, required: true},
	rezervacija: {type: Types.Relationship, ref: 'Reservation', },
});


/**
 * Registration
 */

Objekt.defaultColumns = 'vlasnik, proizvod, kolicina, cijena, datum';
Objekt.register();