 import Ember from 'ember';
/* global $ISIS */

export default Ember.Route.extend({

    beforeModel:function(){
        if($ISIS.getCookie('auth')) {
            this.transitionTo('me');
        }
    },

});
