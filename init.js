require.config({ 
	paths: { 
		jquery: 'lib/jquery',
		backbone: 'lib/backbone',
		underscore: 'lib/underscore',
		text: 'lib/text'
	} 
}); 

require(['backbone', 'underscore', 'gridView'], function(Backbone, _, GridView) {
	
	// Any backbone collection of models can be passed into the gridView
	var exCollection = new Backbone.Collection();
	_.times(100, function(i) {
		exCollection.add({
			id: i,
			title: "Object " + i,
			date: new Date().getTime(),
			count: Math.random() * 100
		});
	});
	
	var formatTitle= function(attr) {
		return '<a href="#' + this.id + '">'+attr+'</a>';
	};
		
	var gridView = new GridView({
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
	
	this.$('#example1').html(gridView.el);

});
