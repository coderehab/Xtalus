import Ember from 'ember';

export default Ember.Route.extend({

    model: function(params, transition) {
        return this.store.createRecord('person');
    },

    setupController: function(controller, model) {
    },

    actions: {

        submitRegistration: function(e) {
            var _this = this;
            var store = this.store;
            var appModel = this.modelFor('application');

            var formdata = this.controller.get('formdata');

            console.log(formdata);

            var params = {

                firstname: formdata.firstname,
                middlename: formdata.middlename,
                lastname: formdata.lastname,
                birthday: formdata.birthday,
                email:formdata.email,
                phone:formdata.phone,
                address:formdata.adress,
                postal:formdata.postal,
                city:formdata.city,
                entity: formdata.entity.value,
                password:formdata.password,
                passwordConfirm:formdata.passwordConfirm,
            }

            params = JSON.stringify(params);

            this.controllerFor('application').sendAction('registration',params).then(function(response){
                console.log(response);
            });



        }
    },
});
