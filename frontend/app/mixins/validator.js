import Ember from 'ember';

export default Ember.Mixin.create({
    validateRequired: function (value, label){
        var value = value || '';
        var error = false;

        label = label || 'Dit veld'
        if (value === '') error = label + 'is verplicht';

        return error;
    },

    validateMatch: function (value1, value2, label){
        var value1 = value1 || '';
        var value2 = value2 || '';

        var error = false;

        label = label || 'De waarde'
        if (value1 !== value2) error = label + ' komt niet overeen';

        return error;
    },

    validatePhone: function (value) {
        var value = value || '';
        var error = false;
        var stripped = value.replace(/[\(\)\.\-\ ]/g, '');

        if (value == "") {
            error = "Uw telefoonnummer is verplicht";
        } else if (isNaN(stripped)) {
            error = "Het telefoonnummer heeft niet het juiste format";
        } else if (!(stripped.length == 10)) {
            error = "Het telefoonnummer heeft niet de juiste lengte";
        }

        return error;
    },

    validateEmail: function (value) {
        var value = value || '';
        var error = false;
        var trimmedValue = value.replace(/^\s+|\s+$/, '');
        var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/ ;
        var illegalChars= /[\(\)\<\>\,\;\:\\\"\[\]]/ ;

        if (value == "") {
            error = "Uw emailadres is verplicht";
        } else if (!emailFilter.test(trimmedValue)) {
            error = "Vul alstubieft een correct emailadres in";
        } else if (value.match(illegalChars)) {
            error = "Het emailadres bevat verkeerde characters";
        }

        return error;
    },

    validatePostal: function (value) {
        var value = value || '';
        var error = false;
        var trimmedValue = value.replace(/\s/g, '');
        var postalFilter = /^[1-9][0-9]{3}[A-Z]{2}$/i ;

        if (value == "") {
            error = "Uw postcode is verplicht";
        } else if(!postalFilter.test(trimmedValue)) {
            error = "Vul alstubieft een correcte postcode in";
        }

        return error;
    },
});
