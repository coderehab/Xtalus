import Ember from 'ember';

export default Ember.Mixin.create({
    validateRequired: function (value, label){
        var value = value || '';
        var error = false;

        // label = label || 'Dit veld'
        if (value === '') error = 'required';

        return error;
    },

    validateMatch: function (value1, value2, label){
        var value1 = value1 || '';
        var value2 = value2 || '';

        var error = false;

        //label = label || 'De waarde'
        if (value1 !== value2) error = 'match';

        return error;
    },

    validatePhone: function (value) {
        var value = value || '';
        var error = false;
        var stripped = value.replace(/[\(\)\.\-\ ]/g, '');

        if (value == "") {
            error = "required";
        } else if (isNaN(stripped)) {
            error = "invalid:chars";
        } else if (!(stripped.length >= 10)) {
            error = "invalid:length.min";
        }

        return error;
    },


   validatePassword: function(value){

      var value = value || '';
        var error = false;

        if (value == "") {
            error = "required";
        } else if (!(value.length >= 6)) {
            error = "invalid:length.min";
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
            error = "required";
        } else if (!emailFilter.test(trimmedValue)) {
            error = "invalid:format";
        } else if (value.match(illegalChars)) {
            error = "invalid:chars";
        }

        return error;
    },

    validatePostal: function (value) {
        var value = value || '';
        var error = false;
        var trimmedValue = value.replace(/\s/g, '');
        var postalFilter = /^[1-9][0-9]{3}[A-Z]{2}$/i ;

        if (value == "") {
            error = "required";
        } else if(!postalFilter.test(trimmedValue)) {
            error = "invalid:format";
        }

        return error;
    },
});
