import Ember from 'ember';
/* global $ */
/* global $ISIS */

var ProjectIndexController = Ember.Controller.extend({


	actions: {

        fileLoaded: function(file) {
            var _this = this;
            console.log(file);
            var post = this.get('store').createRecord('image', {
                image: file,
            });
            post.save().then(function(response){
                console.log(response)
                _this.model.set('updateParams.imageUrl', response.get('url'))
            });
        },

		updateDemand:function() {
			var app = this.controllerFor('application')
			var _this = this;


            this.store.createRecord('image', {})

			this.model.get('isisObj').then(function(isisObj){
				console.log(isisObj);

				$ISIS.get(isisObj.updateDemand.url).then(function(result){


					$ISIS.post(result.links[2].href,_this.model.get('updateParams')).then(function(result){

						console.log('---------OLEE DFDSF----',result);

					})

				})


				/*isisObj.updateDemand.invoke({
					firstName:this.model.get('firstName'),
					middleName:this.model.get('middleName'),
					lastName:this.model.get('lastName'),
					dateOfBirth:this.model.get('birthDay'),
				}).then(function(result){
					app.send('changeView', 'page-left', 0)
				});*/
			}.bind(this));

		},
	}

});

export default ProjectIndexController;
