import DS from 'ember-data';

export default DS.Model.extend({

    owner: DS.belongsTo("person"),
    contactFullname: DS.attr(),
    contactImageUrl: DS.attr({defaultValue:''}),

});
