import Ember from 'ember';

var MeController = Ember.Controller.extend({

    actions: {
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
    }

});

export default MeController;
