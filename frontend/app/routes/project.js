import Ember from 'ember';
import Auth from './auth';
/* global $ISIS */

var ProjectRoute = Auth.extend({
    model: function(params) {
        var demand = this.store.find('demand', params.project_id);
        return demand;
    },

    actions: {
        selectMatchingProfile: function(id){
            this.controllerFor('project.matching').send('selectMatchingProfile', id);
            this.transitionTo('project.matching');
        },
    },

});

export default ProjectRoute;
