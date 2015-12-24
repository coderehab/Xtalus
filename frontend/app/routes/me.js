import Ember from 'ember';
/* global $ISIS */

export default Ember.Route.extend({

    model:function(){
        return this.modelFor('application')
    },

    afterModel: function(model, transition){

    },

    actions: {

    },
});
