require.config({ 
	paths: { 
		jquery: 'lib/jquery',
		backbone: 'lib/backbone',
		underscore: 'lib/underscore',
		text: 'lib/text'
	} 
}); 

require(['backbone', 'underscore', 'jquery', 'exampleView', 
	'text!examples/basicExample.js', 'text!examples/customFormatters.js'], 
	function(Backbone, _, $, ExampleView, basicExample, customFormatters) {
	
	"use strict";

	var examples = new Backbone.Collection(),
		exampleView;

	examples.add([
		{
			title: "Basic Example",
			description: "The GridView can render any Backbone collection. Pass a columns option with an array that specified which model attributes will be displayed in each column. You can also specify the column heading label.",
			code: basicExample
		},
		{
			title: "Custom Formatters",
			description: "A custom formatting function can be applied to any column. The function is passed the attribute value that will be displayed by default. The function itself is executed in the context/scope of the Backbone Model for that row. This gives you access to other attributes of the model if needed.",
			code: customFormatters
		}
	]);

	exampleView = new ExampleView({collection: examples});

	$('body').html(exampleView.el);
	exampleView.render();
	
	// Each column can be passed a function which will customly format
	// the column.  If using a custom formatting function, make sure
	// you escape any embedded values.
	// formatTitle = function(attr) {
	// 	return '<a href="#' + _.escape(this.id) + '">' + _.escape(attr) + '</a>';
	// };
		
	
	
	// $('#example1').html(gridView1.el);
	// gridView1.render();


	// gridView2 = new GridView({
	// 	collection: exCollection,
	// 	columns: [	
	// 		{
	// 			key: 'title',
	// 			label: 'Title',
	// 			formatter: formatTitle
	// 		},				
	// 		{
	// 			key: 'count',
	// 			label: 'Count'
	// 		},
	// 		{
	// 			key: 'date',
	// 			label: 'Date',
	// 			className: 'dateColumn'
	// 		}
	// 	],
	// 	logRenderTime: true
	// });
	
	// $('#example2').html(gridView2.el);
	// gridView2.render();

});
