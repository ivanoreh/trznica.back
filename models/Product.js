/**
 * Created by ivanoreh on 4/13/16.
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Model
 * ==========
 */

var Product = new keystone.List('Product', {
	autokey: {path: 'product', from: 'sifra', unique: true},
    map: {name: 'ime'},
	track: true,
	defaultSort: '-createdAt',
	//noedit: true,
	//nodelete: true
});

Product.add({
    sifra: {type: Types.Text, default: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)},
    ime: {type: Types.Text, default: "", required: true, initial: true},
    slike: {type: Types.CloudinaryImages, publicId: 'product', folder: 'trznica', autoCleanup: true, collapse: true},
    cijena: {type: Types.Number, default: 100, required: true, format: '0,0.00kn', initial: true},
    sharepopust: {type: Types.Boolean, default: false, initial: true },
    sharedputa: {type: Types.Number, default: 0, noedit: true},
    kategorija: {type: Types.Relationship, ref: 'Category', many: true, initial: true},
    detalji: {type: Types.Text, default: "Detalji proizvoda", initial: true},
    certifikati: {type: Types.Relationship, ref: 'Certificate', initial: true},
    vlasnik: {type: Types.Relationship, ref: 'User', initial: true},

});

/**
 * Registration
 */

Product.defaultColumns = 'ime, cijena, sharepopust, sharedputa, kategorija, owner';
Product.register();
