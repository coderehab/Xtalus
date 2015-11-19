import DS from 'ember-data';

export default DS.Model.extend({

    success: DS.attr(),
    errors: DS.attr(),
    activePerson: DS.belongsTo('person', {async: true}),

});
