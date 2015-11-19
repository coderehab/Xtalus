import DS from "ember-data";
import ENV from '../config/environment';
import ApplicationAdapter from 'xtalus/adapters/application';

export default ApplicationAdapter.extend({
    pathForType: function(type) {
        return 'persons';
    },
});
