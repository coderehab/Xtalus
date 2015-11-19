import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
    tagName:'section',
    classNames: 'profile-element',

    data: {},
    params: {},
    actions: {},

    isPassion: function() {
        return this.get('data.description') === 'PASSION_ELEMENT';
    }.property('data.description'),

});
