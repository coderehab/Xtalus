import Ember from 'ember';
/* global $ */

var ProfileIndexRoute = Ember.Route.extend({
	model:function(){
		return this.modelFor('profile');
	},


	actions: {


	},
});

export default ProfileIndexRoute;
