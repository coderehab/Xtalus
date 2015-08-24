import Ember from 'ember';
/* global $ */

var MeIndexRoute = Ember.Route.extend({
    model:function(){
        return this.modelFor('me');
    },

    actions: {

    }
});

export default MeIndexRoute;
