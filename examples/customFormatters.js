var exCollection = new Backbone.Collection(),
	gridView, formatTitle;

_.times(25, function(i) {
	exCollection.add({
		id: i,
		title: 'Object ' + i,
		date: new Date().getTime(),
		count: Math.random() * 100
	});
});

formatTitle = function(attr) {
	return '<a href="#' + _.escape(this.id) + '">' + _.escape(attr) + '</a>';
};
		
gridView = new GridView({
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
	
$('#example').html(gridView.el);
gridView.render();