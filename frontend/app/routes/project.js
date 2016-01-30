import Ember from 'ember';
/* global $ISIS */

export default Ember.Route.extend({

    actions: {
        selectMatchingProfile: function(id){
            this.controllerFor('project.matching').send('selectMatchingProfile', id);
            this.transitionTo('project.matching');
        },
    },

});
