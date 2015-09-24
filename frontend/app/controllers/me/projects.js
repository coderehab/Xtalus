import Ember from 'ember';
/* global $ISIS */

var MeProjectsController = Ember.Controller.extend({

    newProjectParams: {
    },

    actions: {

        showDetails: function(itemID){
            $('section#page').addClass('aside-right');
            this.set('selectedDemand', this.store.find('demand', itemID));
        },

        hideDetails:function(){
            $('section#page').removeClass('aside-right');
            return false;
        },

        createProject: function(){
            var self = this;
            var store = this.store;
            var params = this.get('newProjectParams');
            this.model.get('isisObj').then(function(isisObj){
                console.log(isisObj);
                isisObj.createPersonsDemand.invoke({
                    demandDescription: params.title,
                    demandSummary: params.summary,
                    demandStory: params.story
                }).then(function(){
                    //self.send('refreshDemands');
                    self.send('closePopup', 'new-project');
                    self.set('newProjectParams', {});
                    self.model.reload();
                });
            })

        }
    }
});

export default MeProjectsController;
