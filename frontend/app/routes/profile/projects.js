import Ember from 'ember';

var ProfileProjectsRoute = Ember.Route.extend({

    model: function() {
        return this.modelFor('profile');
    },
});

export default ProfileProjectsRoute;
