var exCollection = new Backbone.Collection(),
	gridView;

_.times(5, function(i) {
	exCollection.add({
		id: _.uniqueId(),
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

$('#example').append('<br><button>Add Model</button>');

$('button').click(function(e) {
	exCollection.add({
		id: _.uniqueId(),
		title: 'New Model',
		date: new Date().getTime(),
		count: Math.random() * 100
	});
});