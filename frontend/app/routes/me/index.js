import Ember from 'ember';
/* global $ */

export default Ember.Route.extend({
    model:function(){
        return this.modelFor('me');
    },

    actions: {

    }
});
