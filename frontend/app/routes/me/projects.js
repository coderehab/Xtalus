import Ember from 'ember';

var MeProjectsRoute = Ember.Route.extend({

    model: function() {
        return this.modelFor('me');
    },

});

export default MeProjectsRoute;
