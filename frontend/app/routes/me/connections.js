import Ember from 'ember';
/* global $ */
/* global $ISIS */

export default Ember.Route.extend({

    model: function() {
        return this.modelFor('me');
    },
});
