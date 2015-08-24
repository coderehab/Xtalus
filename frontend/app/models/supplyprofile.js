import DS from 'ember-data';

export default DS.Model.extend({
    URI: DS.attr(),
    description: DS.attr(),
    profileElements: DS.attr(),
    matches: DS.attr(),
});
