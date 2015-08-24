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
    baseurl: "http://acc.xtalus.gedge.nl/simple/restful/services/info.matchingservice.dom.Api.Api/",
    method: 'GET',
};

loadInitializers(App, config.modulePrefix);

export default App;
