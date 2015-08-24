import Ember from 'ember';
/* global $ */
/* global $ISIS */

var ProjectIndexController = Ember.Controller.extend({


	actions: {
		updateDemand:function() {
			var app = this.controllerFor('application')

			var _this = this;

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
