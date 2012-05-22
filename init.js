require.config({ 
	paths: { 
		jquery: 'lib/jquery',
		backbone: 'lib/backbone',
		underscore: 'lib/underscore',
		text: 'lib/text'
	} 
}); 

require(['backbone', 'underscore', 'jquery', 'gridView'], function(Backbone, _, $, GridView) {
	
	"use strict";

	var exCollection, formatTitle, gridView1, gridView2, gridView3, testView;

	// Any backbone collection of models can be passed into the gridView
	// Randomly generate a collection for demonstration
	exCollection = new Backbone.Collection();
	_.times(25, function(i) {
		exCollection.add({
			id: i,
			title: "Object " + i,
			date: new Date().getTime(),
			count: Math.random() * 100
		});
	});
	
	// Each column can be passed a function which will customly format
	// the column.  If using a custom formatting function, make sure
	// you escape any embedded values.
	formatTitle = function(attr) {
		return '<a href="#' + _.escape(this.id) + '">' + _.escape(attr) + '</a>';
	};
		
	gridView1 = new GridView({
		collection: exCollection,
		columns: [	
			{
				key: 'title',
				label: 'Title'
			},				
			{
				key: 'count',
				label: 'Count'
			},
			{
				key: 'date',
				label: 'Date'
			}
		]
	});
	
	$('#example1').html(gridView1.el);
	gridView1.render();


	gridView2 = new GridView({
		collection: exCollection,
		columns: [	
			{
				key: 'title',
				label: 'Title',
				formatter: formatTitle
			},				
			{
				key: 'count',
				label: 'Count'
			},
			{
				key: 'date',
				label: 'Date',
				className: 'dateColumn'
			}
		],
		logRenderTime: true
	});
	
	$('#example2').html(gridView2.el);
	gridView2.render();

});
