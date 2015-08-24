import Ember from 'ember';

/* global $ISIS */

var ProjectenController = Ember.Controller.extend({

    actions: {
        showDetails: function(itemID){
            $('section#page').addClass('aside-right');
            this.set('selectedDemand', this.store.find('demand', itemID));
        },

        hideDetails:function(){
            $('section#page').removeClass('aside-right');
            return false;
        },
    }
});

export default ProjectenController;
