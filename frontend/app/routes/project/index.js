import Ember from 'ember';
/* global $ */

export default Ember.Route.extend({

    model: function() {
        return this.modelFor('project');
    },

    actions: {

        delProject: function(){
            var store = this.store;
            var self = this;
            console.log(this);
            var ISISdemand = this.controller.get('model.isisObj');

            var confirmed = confirm("Weet je het zeker?");

            if(confirmed) {
                ISISdemand.then(function(demandObj){
                    demandObj.deleteDemand.invoke({confirmDelete: confirmed}).then(function(){
                        self.transitionTo('me.projects');
                        self.modelFor('me').reload();
                    });
                })
            }
        },

    },
});
