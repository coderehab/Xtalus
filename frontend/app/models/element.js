import DS from 'ember-data';

export default DS.Model.extend({

    description: DS.attr(),
    weight: DS.attr(),
    widgetType: DS.attr(),
    tagholders: DS.hasMany("tagholder"),
    textValue: DS.attr(),
    weight: DS.attr(),


});
