import DS from "ember-data";
import ENV from '../config/environment';
import ApplicationAdapter from 'xtalus/adapters/application';

export default ApplicationAdapter.extend({
	pathForType: function(type) {
		return 'persons';
	},

	headers: function() {
		var user_cookie = $ISIS.getCookie('auth');
		return {
			"Authorization": $ISIS.authHeader
		};
	}.property("session.authToken"),
});
