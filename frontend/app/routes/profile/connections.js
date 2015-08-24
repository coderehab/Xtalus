import Ember from 'ember';
/* global $ISIS */
/* global $ */

var ProfileConnectionsRoute = Ember.Route.extend({

    model: function() {
        return this.modelFor('profile');
    },
});

export default ProfileConnectionsRoute;
