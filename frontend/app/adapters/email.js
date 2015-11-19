import DS from 'ember-data';
import ENV from '../config/environment';

console.log(ENV);

export default DS.Adapter.extend({
    host: ENV.APP.API_PHP_HOST,

    createRecord: function(store, type, snapshot) {
        var jdata = [];
        var data = this.serialize(snapshot, { includeId: true });
        var url = ENV.APP.API_HOST + "/mail/" + data.type + "/" + data.subject;

        jdata = {"data":data};
        console.log(jdata)

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(jdata),
                dataType: "json"
            }).then(function(data) {
                Ember.run(null, resolve, data);
            }, function(jqXHR) {
                jqXHR.then = null; // tame jQuery's ill mannered promises
                Ember.run(null, reject, jqXHR);
            });
        });
    },

    headers: function() {

        var user_cookie = $ISIS.getCookie('auth');
        return {
            "Content-Type": "application/javascript"
        };

    }.property("session.authToken")

});
