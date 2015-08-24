import Ember from 'ember';
/* global $ISIS */

var LoginController = Ember.Controller.extend({

    actions: {
        login: function(){
            $ISIS.auth.login(this.get("username"), this.get("password")).then(function(data){
                console.log(data);
                if (data.message) {
                    this.set('message', data.message);
                    return;
                }else {
                    this.get('target.router').refresh();
                }
            }.bind(this));

            return false;
        },
    },

});
export default LoginController;
