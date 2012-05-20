define(
	["backbone","underscore", 'text!templates/grid.html', 'text!templates/row.html'],
function( Backbone, _ , GridTemplate, RowTemplate) {
	
	var RowView, GridView;

	RowView = Backbone.View.extend({
		tagName: "tr",
		className: "gvRow",
		initialize: function() {
			this.render();			
			this.model.on("change", this.render, this);
		},
		render: function() {		
			this.$el.html(this.options.rowTemplate({model: this.model.toJSON(), options: this.options}));			
		}
	});
	
	GridView = Backbone.View.extend({
		
		className: "gridView",
	
		initialize: function() {
			this.time = new Date().getTime();
			
			this.gridTemplate = _.template(GridTemplate, undefined, {variable: 'o'});
			this.rowTemplate = _.template(RowTemplate, undefined, {variable: 'o'});
			
			this.options = _.extend({
				autoRenderRows: true,
				autoRenderNewRows: true,
				autoRemoveRows: true,
				width: 700,
				height:300,
				logRenderTime: false
			}, this.options);
			
			
			this.render();	
			
			if(this.options.logRenderTime) console.log("Render time (ms)", (new Date().getTime()) - this.time);	
				
		},
		
		render: function() {
			this.$el.html(this.gridTemplate({options: this.options}));
			this.buildGrid();
		},
		
		buildGrid: function() {
			var $gvGrid = this.$('.gvGrid');
			$gvGrid.html("").hide();
			this.collection.each(this.buildRow, this);
			$gvGrid.show();
			
			if(this.options.onRender) this.options.onRender.call(this);
		},
		
		buildRow: function(model, i) {			
			var rowView = new RowView(_.extend(this.options, {model: model, rowTemplate: this.rowTemplate}));
			this.$('.gvGrid').append(rowView.el);
		}
		
	});
	
	return GridView;
	
});
