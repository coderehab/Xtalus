import Ember from 'ember';
import Auth from './auth';
/* global $ISIS */

var MeRoute = Auth.extend({

    beforeModel:function(){
        //if(this.controller) this.controller.init();
        if(!$ISIS.getCookie('auth')) {
            this.transitionTo('login');
        }
    },

    model:function(){
        return this.modelFor('application')
    },

    actions: {

    },
});

export default MeRoute;
