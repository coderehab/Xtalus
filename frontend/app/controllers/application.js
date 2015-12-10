import Ember from 'ember';
import ENV from '../config/environment';
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

	//  Post actions
	sendAction: function(actionName,params){

		return new Promise(function(resolve, reject) {
			Ember.$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: ENV.APP.API_HOST+'/'+ENV.APP.API_NS+"/actions/"+actionName,
				data: params
			}).done(function(response){
				resolve(response);
			}).fail(function(error) {
				reject(error);
			});
		});

	},

	saveImage: function(params){
		return new Promise(function(resolve, reject) {
			Ember.$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: ENV.APP.API_PHP_HOST+'/images',
				data: params
			}).done(function(response){
				resolve(response);
			}).fail(function(error) {
				reject(error);
			});
		});
	},

	sendMail: function(params){
		return new Promise(function(resolve, reject) {
			Ember.$.ajax({
				type: "POST",
				contentType: "application/json; charset=utf-8",
				url: ENV.APP.API_PHP_HOST+'/mail',
				data: params
			}).done(function(response){
				resolve(response);
			}).fail(function(error) {
				reject(error);
			});
		});
	},

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
