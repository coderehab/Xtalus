import DS from "ember-data";
import ENV from '../config/environment';

var adapterSettings = {};

export default DS.RESTAdapter.extend({
    host: ENV.APP.API_HOST,
    namespace: '',
});
