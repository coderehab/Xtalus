import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

/* global $ISIS */

export default Ember.Route.extend({

	globalSearchQuery:"",
	authDisabled: false,

	beforeModel: function(transition){
		if(
			transition.targetName == 'login' ||
			transition.targetName == 'registration.index' ||
			transition.targetName == 'registration.complete'
		){
			this.set('authDisabled', true);
		}
	},

	model: function(){
		var _this = this;
		var store = this.store;
		if($ISIS.getCookie('auth')){
			return Ember.$.ajax({
				type: 'GET',
				url: ENV.APP.API_HOST + '/' +ENV.APP.API_NS + '/actions/activeperson',
				headers: {
					"Authorization": $ISIS.getCookie('auth')
				},
				success : function(response) {
					if(!response.success){
						$ISIS.auth.logout();
						_this.transitionTo('login');
					}
				}
			});
		}else{
			if(!this.get('authDisabled')) this.transitionTo('login');
		}
	},

	actions: {
		toRoute:function(routename=false, id=false){
			if(!routename) console.error('routename is required');
			if(id)
				this.transitionTo(routename, id);
			else
				this.transitionTo(routename);
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
