import Ember from 'ember';
/* global $ISIS */

var LoginController = Ember.Controller.extend({

	actions: {
		login: function(){
			var _this = this;
			var params = {
				email:this.get("email"),
				password: this.get("password")
			}

			this.controllerFor('application').sendAction('login', params).then(
				function(response){
					$ISIS.setCookie('auth', 'Basic ' + $ISIS.auth.base64.encode(params.email + ':' + params.password), 5);
					location.reload();
				},
				function(errors){
					console.log(errors.responseJSON);

					var errors = errors.responseJSON.errors;

					_this.set('errors', errors);
				}
			);
		},
	},
});

export default LoginController;
