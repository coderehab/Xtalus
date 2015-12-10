import Ember from 'ember';
import DS from 'ember-data';

/* global $ISIS */

export default Ember.Route.extend({

	globalSearchQuery:"",

	model: function(){

		//var app = this.store.find('application', 'login');
		var store = this.store;
		if($ISIS.getCookie('auth'))

			return $ISIS.get('http://test.xtalus.gedge.nl/simple/restful/v2/action/login').then(function(app){
				return store.find('person', app.application.activePerson);
			})

			},

	actions: {

		fileLoaded: function(file) {
			var _this = this;
			console.log(file);

			this.controller.saveImage('registration',file).then(function(response){
				console.log(response.get('url'));
			});
		},

		login: function(){
			$ISIS.auth.login(this.get("username"), this.get("password")).then(function(data){
				console.log(data);
				if (data.message) {
					this.set('message', data.message);
					return;
				}else {
					this.get('target.router').refresh();
				}
			}.bind(this));

			return false;
		},

		getProject:function(id){
			this.transitionTo('project', id);
		},

		getProfile: function(id){
			this.transitionTo('profile', id);
		},

		toggleUsernav:function(){
			Ember.$('body').toggleClass('user-nav-small');
			return false;
		},

		changeView:function(viewID, slideID, type) {

			for(var i=0; i<10; i++){
				$("#" + viewID).removeClass('slide-'+i)
			}

			$("#" + viewID).addClass('slide-'+slideID)
			console.log('slide-'+slideID);
			return false;
		},

		showPopup: function(name){
			Ember.$('section#page #' + name + '.popup').toggleClass('visible');
			Ember.$('section#page').toggleClass('popup-' + name);
			return false;
		},

		closePopup: function(name){
			Ember.$('section#page #' + name + '.popup').removeClass('visible');
			Ember.$('section#page').removeClass('popup-' + name);
			return false;
		},

		logout: function(){
			$ISIS.auth.logout();
			this.transitionTo('login');
		},

		createPersonalContact: function(id){
			var self = this;
			this.store.find('person', id).then(function(person){
				var ISISdemand = person.get('isisObj');
				ISISdemand.then(function(profileObj){
					if (!profileObj.addAsPersonalContact) {
						alert(profileObj.firstName + ' is al een connectie');
						return
					}
					profileObj.addAsPersonalContact.invoke().then(function(){
						self.controller.model.get('activePerson').content.reload()
						alert(profileObj.firstName + ' is toegevoegd aan uw connecties');
					});
				})
			})

		},

		deletePersonalContact: function(){

		},

	}
});
