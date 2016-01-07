import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
/* global $ISIS */

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;
Ember.deprecate = function(){}

App = Ember.Application.extend({
    modulePrefix: config.modulePrefix,
    podModulePrefix: config.podModulePrefix,
    Resolver: Resolver,
});

$ISIS.settings = {
		baseurl: 'http://test.xtalus.gedge.nl/simple/restful/v2/actions/login',
    method: 'POST',
};

loadInitializers(App, config.modulePrefix);

export default App;
