import DS from 'ember-data';

export default DS.Model.extend({
    type:DS.attr(),
    subject:DS.attr(),
    email:DS.attr(),
    firstname:DS.attr(),
    lastname:DS.attr(),

});
