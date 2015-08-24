import DS from "ember-data";

var adapterSettings = {};

export default DS.RESTAdapter.extend({
    host: 'http://acc.xtalus.gedge.nl/simple/restful/v1',
    namespace: '',

    headers: function() {

        var user_cookie = $ISIS.getCookie('auth');
        return {
            "Authorization": $ISIS.authHeader
        };

    }.property("session.authToken")
});
