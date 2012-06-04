var exCollection = new Backbone.Collection(),
	gridView;

_.times(10, function(i) {
	exCollection.add({
		id: i,
		title: 'Object ' + i,
		date: new Date().getTime(),
		count: Math.random() * 100
	});
});

gridView = new GridView({
	collection: exCollection,
	columns: [	
		{
			key: 'title',
			label: 'Title',
			editable: true
		},				
		{
			key: 'count',
			label: 'Count'
		},
		{
			key: 'date',
			label: 'Date',
			editable: true
		}
	]
});

$('#example').html(gridView.el);
gridView.render();