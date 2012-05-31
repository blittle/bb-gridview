require.config({ 
	paths: { 
		jquery: 'lib/jquery',
		backbone: 'lib/backbone',
		underscore: 'lib/underscore',
		text: 'lib/text'
	} 
}); 

require(['backbone', 'underscore', 'jquery', 'exampleView', 
	'text!examples/basicExample.js', 'text!examples/customFormatters.js', 'text!examples/columnSelection.js'], 
	function(Backbone, _, $, ExampleView, basicExample, customFormatters, columnSelection) {
	
	"use strict";

	var examples = new Backbone.Collection(),
		exampleView;

	examples.add([
		{
			title: "Basic Example",
			description: "The GridView can render any Backbone collection. Pass a columns option with an array that specifies which model attributes will be displayed in each column. You can also specify the column heading label.",
			code: basicExample
		},
		{
			title: "Custom Formatters",
			description: "A custom formatting function can be applied to any column. The function is passed the attribute value that will be displayed by default. The function itself is executed in the context/scope of the Backbone Model for that row. This gives you access to other attributes of the model if needed.",
			code: customFormatters
		},
		{
			title: "Selection Column",
			description: 'Enable column selection by passing "selectionColumn: true" as an option. Optionally, provide a backbone collection which will represent the rows/models that are currently selected. Bind on this collection to be notified when the user selects a row. By default row selection is enabled even without the selection column, to disable it pass the option selection: false',
			code: columnSelection
		}
	]);

	exampleView = new ExampleView({collection: examples});

	$('body').html(exampleView.el);
	exampleView.render();

});
