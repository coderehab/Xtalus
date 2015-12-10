import Ember from 'ember';
/* global $ */

export default Ember.Route.extend({
    model:function(){
        return this.modelFor('me');
    },

    actions: {
			uploadProfilePicture: function(file) {

				var _this = this;
				this.controllerFor('application').saveImage({
					image:file
				}).then(function(response){
					response = JSON.parse(response)
					console.log(response);
					_this.modelFor('me').set('picture', response.image.name)
				});
			},
    }
});
