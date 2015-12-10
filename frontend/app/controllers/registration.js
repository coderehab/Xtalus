import Ember from 'ember';
import Validator from '../mixins/validator';

var RegistrationController = Ember.Controller.extend(Validator, {

    formdata:{
        firstName: 'mathijs',
        middleName: '',
        lastName: 'jansen',
        email:'mathijs@code.rehab',
        phone: '0612345678',
        address: 'kemnalanden 9',
        postal: '7542HL',
        city: 'Enschede',
        entity: {label:'Student', value:'student'},
        password:'password',
        passwordConfirm:'password',
    },
    form:{
        entities: [
            {label:'Student', value:'student'},
            {label:'Zper', value:'zp'},
            {label:'Mkber', value:'mkb'},
        ]
    },

    actions: {
        submitRegistration: function(){
            var validated = true;
            var formdata = this.get('formdata');
            var errors = {};

            //firstname
            validated = this.validateRequired(formdata.firstName) ? false : true;
            if (!validated) errors.firstName = this.validateRequired(formdata.firstName);;

            //lastname
            validated = this.validateRequired(formdata.lastName) ? false : true;
            if (!validated) errors.lastName = this.validateRequired(formdata.lastName);

            //email
            validated = this.validateEmail(formdata.email) ? false : true;
            if (!validated) errors.email = this.validateEmail(formdata.email);

            //phone
            validated = this.validatePhone(formdata.phone) ? false : true;
            if (!validated) errors.phone = this.validatePhone(formdata.phone);

            //address
            validated = this.validateRequired(formdata.address) ? false : true;
            if (!validated) errors.address = this.validateRequired(formdata.address);

            //postal
            validated = this.validatePostal(formdata.postal) ? false : true;
            if (!validated) errors.postal = this.validatePostal(formdata.postal);

            //city
            validated = this.validateRequired(formdata.city) ? false : true;
            if (!validated) errors.city = this.validateRequired(formdata.city);

            //entity
            validated = this.validateRequired(formdata.entity) ? false : true;
            if (!validated) errors.entity = this.validateRequired(formdata.entity);

            //password
            validated = this.validatePassword(formdata.password) ? false : true;
            if (!validated) errors.password = this.validatePassword(formdata.password);

            //passwordConfirm
            validated = this.validateMatch(formdata.password, formdata.passwordConfirm) ? false : true;
            if (!validated) errors.passwordConfirm = this.validateMatch(formdata.password, formdata.passwordConfirm);

            this.set('errors', errors);
            console.log(Object.keys(errors).length);
            return (Object.keys(errors).length === 0);
        }
    }
});

export default RegistrationController;
