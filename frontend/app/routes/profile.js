import Ember from 'ember';
import Auth from './auth';
/* global $ISIS */

export default Ember.Route.extend({

    model: function(params) {
        return this.store.find('person', params.user_id)
    },
});
