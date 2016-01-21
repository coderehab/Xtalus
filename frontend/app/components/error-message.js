import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
	tagName:'span',
	classNames: 'error-message',
	key:null,
	field:null,

	//quickfix!! need to change later on in the project!!
	messages:{
		"required": "Dit veld is verplicht",
		"invalid": "De waarde is ongeldig",
		"invalid:format": "De waarde is ongeldig",
		"invalid:chars": "De waarde bevat ongeldige karakters",
		"invalid:length.min": "Te weinig karakters",
		"exists": "Er bestaat al een account met deze waarde",
		"match": "De waardes komen niet overeen",
		"password.match": "Wachtwoorden komen niet overeen",
		"email.exists": "Dit e-mailadres wordt al gebruikt",
		"account.not:active": "Uw account dient nog geactiveerd te worden. Dit zal binnen enkele werkdagen gebeuren. U ontvangt per e-mail een bericht zodra dit is voltooid.",
		"account.not:match.credentials": "Wachtwoord of emailadres is onjuist.",
	},

	errorMessage: function(){
		var key = this.get('key');
		var field = this.get('field');
		var message = this.get('messages')[field+ "." +key];
		if(!message) message = this.get('messages')[key];

		return message || key;
	}.property('key'),
});
