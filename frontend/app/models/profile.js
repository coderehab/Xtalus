import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    elements: DS.hasMany('element'),
    weight: DS.attr(),
    type: DS.attr(),
    owner: DS.belongsTo('person'),
});
