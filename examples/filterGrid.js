var exCollection = new Backbone.Collection(),
	gridView;

_.times(100, function(i) {
	exCollection.add({
		id: i,
		title: (i%2 ? 'California' : i%3 ? 'New York' : i%5 ? 'Utah' : 'Oregon') +  ' ' + i,
		date: new Date().getTime(),
		count: Math.random() * 100
	});
});

$('#example').html('Filter the grid: <input type="text" id="search"/><br>');

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
	],
	externalFilter: $('#search')
});

$('#example').append(gridView.el);
gridView.render();