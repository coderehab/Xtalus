import DS from 'ember-data';

export default DS.Model.extend({
    isis: DS.attr({defaultValue:{}}),
    activePerson: DS.attr({defaultValue:{}}),
    globalSearchQuery:DS.attr(),
});
