import Ember from 'ember';
/* global $ISIS */

var AuthRoute = Ember.Route.extend({

    beforeModel:function(){
        if(!$ISIS.getCookie('auth')) {
          this.transitionTo('login');
        }
    },

    setupController: function(controller, model){
        controller.set('activePerson', this.modelFor('application').get('activePerson'))
        controller.set('model', model)
        console.log("\nPage referentie:\n",'--------------------------------------------------', controller, "===================================================\n");
    },

    actions: {
        logout: function(){
            $ISIS.auth.logout();
            this.transitionTo('login');
        },
    }
});

export default AuthRoute;
