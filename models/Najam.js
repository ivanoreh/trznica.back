/**
 * Created by ivanoreh on 4/13/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Model
 * ==========
 */

var Najam = new keystone.List('Najam', {
	autokey: {path: 'najam', from: 'sifProdavac, sifObjekt, od, do', unique: true},
	track: true,
	defaultSort: '-createdAt',
	//nodelete: true
});

Najam.add({
	sifProdavac: {type: Types.Relationship, ref: "User", required: true, initial: true},
	sifObjekt: {type: Types.Relationship, ref: "Objekt", required: true, initial: true},
	cijena: {type: Types.Number, required: true, initial: true},
	od: {type: Types.Datetime, required: true, initial: true},
	do: {type: Types.Datetime, required: true, initial: true}
});



/**
 * Registration
 */

Najam.defaultColumns = 'sifProdavac, sifObjekt, cijena, od, do';
Najam.register();
