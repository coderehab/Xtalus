import Ember from 'ember';
/* global $ISIS */

var ApplicationController = Ember.Controller.extend({

    findPerson:function(){
        this.set('globalSearchResults', null);
        var searchQuery = this.get('globalSearchQuery');
        if (!searchQuery || searchQuery == ' ') {
            searchQuery = "-";
        }
        var _this = this;
        $ISIS.get('http://acc.xtalus.gedge.nl/simple/restful/v1/find/'+searchQuery).then(function(response){
            console.log(searchQuery, response);
            var result = response.results;
            if (result.Demand.length === 0 && result.Person.length === 0)
                result = null;

            _this.set('globalSearchResults', result)
        });
    }.observes('globalSearchQuery'),

    actions: {
        handleSearchResultClick:function(type, id){
            this.set('globalSearchQuery', '');
            this.set('globalSearchResults', null)
            switch (type){
                case 'person':
                    this.send('getProfile', id);
                    break;
                case 'project':
                    this.send('getProject', id);
                    break;
                default :
                    console.error('type not available, not able to handle "handleSearchResultClick"')
                    break;
            }
        },
    },

});
export default ApplicationController;
