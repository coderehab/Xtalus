import Ember from 'ember';
import Validator from '../mixins/validator';

var RegistrationController = Ember.Controller.extend(Validator, {

    formdata:{
        firstname: '',
        middlename: '',
        lastname: '',
        email:'',
        birthday: '',
        phone: '',
        address: '',
        postal: '',
        city: '',
        entity: {label:'Student', value:'student'},
        password:'',
        passwordConfirm:'',
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
            validated = this.validateRequired(formdata.firstname) ? false : true;
            if (!validated) errors.firstname = 'Voornaam is verplicht';

            //lastname
            validated = this.validateRequired(formdata.lastname) ? false : true;
            if (!validated) errors.lastname = 'Achternaam is verplicht';

            //birthdate
            validated = this.validateRequired(formdata.birthday) ? false : true;
            if (!validated) errors.birthday = 'Uw birthdate is verplicht';

            //email
            validated = this.validateEmail(formdata.email) ? false : true;
            if (!validated) errors.email = this.validateEmail(formdata.email);

            //phone
            validated = this.validatePhone(formdata.phone) ? false : true;
            if (!validated) errors.phone = this.validatePhone(formdata.phone);

            //address
            validated = this.validateRequired(formdata.address) ? false : true;
            if (!validated) errors.address = 'Het adres is verplicht';

            //postal
            validated = this.validatePostal(formdata.postal) ? false : true;
            if (!validated) errors.postal = this.validatePostal(formdata.postal);

            //city
            validated = this.validateRequired(formdata.city) ? false : true;
            if (!validated) errors.city = 'Uw woonplaats is verplicht';

            //entity
            validated = this.validateRequired(formdata.entity) ? false : true;
            if (!validated) errors.entity = 'Uw entiteit is verplicht';

            //password
            validated = this.validateRequired(formdata.password) ? false : true;
            if (!validated) errors.password = 'wachtwoord is verplicht';

            //passwordConfirm
            validated = this.validateMatch(formdata.password, formdata.passwordConfirm) ? false : true;
            if (!validated) errors.passwordConfirm = 'Wachtwoorden komen niet overeen';

            this.set('errors', errors);
            console.log(Object.keys(errors).length);
            return (Object.keys(errors).length === 0);
        }
    }
});

export default RegistrationController;
