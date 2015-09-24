import Ember from 'ember';
import Auth from './auth';
/* global $ISIS */

var ProfileRoute = Auth.extend({

    model: function(params) {
        return this.store.find('person', params.user_id)
    },
});

export default ProfileRoute;
