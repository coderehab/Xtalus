import DS from 'ember-data';

export default DS.Model.extend({

    category: DS.attr(),
    dateLastUsed: DS.attr(),
    numberOfTimesUsed: DS.attr(),
    value: DS.attr(),
    element: DS.belongsTo('element')


});
