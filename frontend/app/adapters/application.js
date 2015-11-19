import DS from "ember-data";
import ENV from '../config/environment';

var adapterSettings = {};

export default DS.RESTAdapter.extend({
    host: ENV.APP.API_HOST,

    pathForType: function(type) {
        return ENV.APP.API_NS + '/action';
    },

    extract: function(loader, json, type, record) {
        var root = this.rootForType(type);

        this.sideload(loader, type, json, root);
        this.extractMeta(loader, type, json);

        if (json[root]) {
            if (record) { loader.updateId(record, json[root]); }
            this.extractRecordRepresentation(loader, type, json[root]);
        }
    },

    headers: function() {
        $ISIS.auth.login('frans', 'pass');
        var user_cookie = $ISIS.getCookie('auth');
        return {
            "Authorization": $ISIS.authHeader
        };

    }.property("session.authToken")
});
