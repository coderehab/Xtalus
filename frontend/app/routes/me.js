import Ember from 'ember';
/* global $ISIS */

export default Ember.Route.extend({

	model:function(){

		var personId = this.modelFor('application').id

		return this.store.find('person', personId)

		//return this.store.find('person', personId);

	},

	afterModel: function(model, transition){

	},

	actions: {
	},
});
