import Ember from 'ember';
/* global $ISIS */
/* global $ */

export default Ember.Route.extend({

    model: function() {
        return this.modelFor('profile');
    },
});
