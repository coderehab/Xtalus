import Ember from 'ember';
/* global $ */

var MeConnectionController = Ember.Controller.extend({

    actions: {
        showConnectionDetails: function(personData){
            this.set("selectedPerson", this.store.find('person', personData.contactId));
            $('section#page').addClass('aside-right');
            return false;
        },

        hideConnectionDetails: function(){
            $('section#page').removeClass('aside-right');
            return false;
        },
    },
});

export default MeConnectionController;
