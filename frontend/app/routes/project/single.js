import Ember from 'ember';
/* global $ */

export default Ember.Route.extend({

	model: function() {
				return this.store.find('project', params.project_id);
	},

	actions: {

	},
});
