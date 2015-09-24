import DS from 'ember-data';

export default DS.Model.extend({
    image:DS.attr(),
    url:DS.attr(),
    name:DS.attr(),
});
