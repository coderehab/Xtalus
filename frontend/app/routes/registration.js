import Ember from 'ember';

var RegistrationRoute = Ember.Route.extend({

    model: function(params, transition) {
        return this.store.createRecord('person');
    },

    setupController: function(controller, model) {
    },

    actions: {
        //{"username" : "hoi1234" , "password" : "hoi", "passwordConfirm" : "hoi", "email" : "email.johan@somewhere.nl"}
        //$ISIS.put('http://acc.xtalus.gedge.nl/simple/restful/register')

        submitRegistration: function(e) {
            var _this = this;
            var store = this.store;
            var appModel = this.modelFor('application');

            var formdata = this.controller.get('formdata');
            console.log(formdata);
            var params = {
                username:formdata.username,
                password:formdata.password,
                passwordConfirm:formdata.passwordConfirm,
                email:formdata.email
                //,
                //phone:formdata.phone,
                //address:formdata.adress,
                //city:formdata.city,
                //postal:formdata.postal,

            }


            $ISIS.auth.logout();
            $ISIS.post('http://acc.xtalus.gedge.nl/simple/restful/register', params, false)
                .then(function(result){

                if(result.success == 1){

                    _this.store.createRecord('email', {
                        email:params.email,
                        type:"confirm",
                        subject:"registration",
                        title:"Xtalus registratie",
                        firstname:formdata.firstname,
                        middlename:formdata.middlename,
                        lastname:formdata.lastname,
                    }).save();

                    _this.store.createRecord('email', {
                        email:'info@xtalus.nl',
                        type:"notify",
                        subject:"new_registration",
                        title:"Nieuwe Aanmelding",
                        firstname:formdata.firstname,
                        middlename:formdata.middlename,
                        lastname:formdata.lastname,
                    }).save();

                    $ISIS.auth.login(formdata.username, formdata.password).then(function(data){
                        $ISIS.init().then(function(isis){

                            //appModel.isis = isis;
                            appModel.set('isis',isis)

                            var personData = {
                                firstName: formdata.firstname,
                                middleName: formdata.middlename,
                                lastName: formdata.lastname,
                                dateOfBirth: formdata.birthday,
                            }

                            if(formdata.entity.value === 'student') {
                                isis.createStudent.invoke(personData).then(function(personID){
                                    console.log(personID)
                                    return store.find('person', personID).then(function(person){
                                        var isis = store.createRecord('isis');
                                        appModel.set('activePerson', person);
                                        _this.transitionTo('me');
                                    })
                                })
                            }

                            if(formdata.entity.value === 'zp') {
                                isis.createProfessional.invoke(personData).then(function(personID){
                                    return store.find('person', personID).then(function(person){
                                        var isis = store.createRecord('isis');
                                        appModel.set('activePerson', person);
                                        _this.transitionTo('me');
                                    })
                                })
                            }

                            if(formdata.entity.value === 'mkb') {
                                isis.createPrincipal.invoke(personData).then(function(personID){
                                    return store.find('person', personID).then(function(person){
                                        var isis = store.createRecord('isis');
                                        appModel.set('activePerson', person);
                                        _this.transitionTo('me');
                                    })
                                })
                            }
                        });
                    });
                }else {
                    alert('Registration failed');
                }
            });
        }
    },
});

export default RegistrationRoute;
