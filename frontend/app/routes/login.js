 import Ember from 'ember';
/* global $ISIS */

var LoginRoute = Ember.Route.extend({

    beforeModel:function(){
        if($ISIS.getCookie('auth')) {
            this.transitionTo('me');
        }
    },

});

export default LoginRoute;
