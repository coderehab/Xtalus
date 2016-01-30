import Ember from 'ember';

var MeController = Ember.Controller.extend({

	actions: {

		saveProfileHeaderImage:function(params){
			var _this = this;
			this.controllerFor('application').saveImage(params).then(function(response){

				_this.model.set('pictureBackground', response.image.url);
			},function(){
				alert("Uploading image failed");
			})
		},

		saveProfileImage:function(params){
			var _this = this;
			this.controllerFor('application').saveImage(params).then(function(response){
				_this.model.set('picture', response.image.url);
			},function(){
				alert("Uploading image failed");
			})
		},

		updatePerson:function() {
			var app = this.controllerFor('application')
			this.model.get('isisObj').then(function(isisObj){
				console.log(isisObj);
				isisObj.updatePerson.invoke({
					firstName:this.model.get('firstName'),
					middleName:this.model.get('middleName'),
					lastName:this.model.get('lastName'),
					dateOfBirth:this.model.get('birthDay'),
				}).then(function(result){
					app.send('changeView', 'page-left', 0)
				});
			}.bind(this));

		},

		enterEditMode:function(){
			$("body").addClass('editmode');
			this.set("editmode", true);
		},

		exitEditMode:function(){
			$("body").removeClass('editmode');
			this.set("editmode", false);
			console.log(this.model.save());
		},
	}

});

export default MeController;
