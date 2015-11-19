import Ember from 'ember';
/* global $ */

export default Ember.Route.extend({

    model: function() {
        var project = this.modelFor('project');
        return project;
    },

    setupController:function(controller, model){
        controller.set('model', model);
        if(model.get('profiles')[0])
            controller.send('selectMatchingProfile', model.get('profiles')[0].id);
    }
});
