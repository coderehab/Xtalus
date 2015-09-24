import Ember from 'ember';

var UserView = Ember.View.extend({
	tagName: 'section',
	elementId: 'page',
    classNames: ['profile', 'aside-left']
});

export default UserView;
