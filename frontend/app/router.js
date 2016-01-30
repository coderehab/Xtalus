import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
	location: config.locationType
});

export default Router.map(function() {
	this.route('index');
	this.route('login', {path:"/"});

	this.route('forgot');
	this.route('help');

	this.resource('registration',function(){
		this.route('complete');
	});

	this.resource('me',function(){
		this.route('connections');
		this.route('projects');
		this.route('courses');
		this.route('references');
		this.route('settings');
	});

	this.resource('profile', {path:"profile/:user_id"}, function(){
		this.route('connections');
		this.route('projects');
		this.route('courses');
		this.route('references');
	});

	this.resource('project', {path:"projects"}, function(){
		this.route('single',{path:"project/:project_id"});

		this.route('matching');
	});
});
