import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
	tagName:'div',
	classNames: 'editable',
	active:false,
	selected:false,
	classNameBindings: [
		'isEditing',
		'isTextarea:type-textarea',
		'isDate:type-date',
		'isLabel:type-label',
	],

	init:function(){
		this._super();
		var _this = this;

		/*Ember.$('body').on('click', function(e){
			var tag = $(e.target).prop("tagName");

			if(
				tag == "INPUT" ||
				tag == "TEXTAREA"
			){
				return;
			}

			$("#" + _this.elementId).closest('.editable-group').removeClass('is-editing');
			_this.set('selected', false);
		});*/
	},

	isEditing: function (){
		return this.get('active') || this.get('selected');
	}.property('active', 'selected'),

	isTextarea:function(){
		var type = this.get('type');

		$(function(){
		$("textarea").css('width', '100%')
		$("textarea").css('height', '400px')
		})

		return (type == "textarea")
	}.property('type'),

	isText:function(){
		var type = this.get('type');
		return (type == "text")
	}.property('type'),

	isLabel:function(){
		var type = this.get('type');
		return (type == "label")
	}.property('type'),

	isDate:function(){
		var value = this.get('value');
		var type = this.get('type');
		var divider = this.get("divider")

		var fields = value.split('-');
		this.set('val1', fields[0])
		this.set('val2', fields[1])
		this.set('val3', fields[2])

		return (type == "date")
	}.property('type'),

	updateValue: function(){

		if(!this.get('active') && !this.get('selected') ){
			if(this.type=='date'){
				var value = this.get('val1') + "-" + this.get('val2') + "-" + this.get('val3');
				this.set('value', value);
			}
		}

	}.observes('active', 'selected'),

	/*mouseUp: function(){
		$("#" + this.elementId).closest('.editable-group').addClass('is-editing');
		this.set('selected', true);
	},*/


});
