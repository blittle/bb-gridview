var exCollection = new Backbone.Collection(),
	selectedModels = new Backbone.Collection(),
	gridView;

_.times(25, function(i) {
	exCollection.add({
		id: i,
		title: 'Object ' + i,
		date: new Date().getTime(),
		count: Math.random() * 100
	});
});

gridView = new GridView({
	collection: exCollection,
	selectedModels: selectedModels,
	selectionColumn: true,
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

$('#example').html(gridView.el);
gridView.render();