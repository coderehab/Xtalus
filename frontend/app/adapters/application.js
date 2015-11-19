import DS from "ember-data";
import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
    host: ENV.APP.API_HOST,
    namespace: ENV.APP.API_NS,

    headers: function() {
        var user_cookie = $ISIS.getCookie('auth');
        return {
            "Authorization": $ISIS.authHeader
        };
    }.property("session.authToken"),

});
