define(
	["backbone","underscore", 'text!templates/grid.html', 'text!templates/row.html'],
function( Backbone, _ , GridTemplate, RowTemplate) {
	
	var RowView, GridView;

	RowView = Backbone.View.extend({
		tagName: "tr",
		className: "gvRow",
		initialize: function() {
			if(this.options.selection) {
				this.events.click = "selectRow";

				if(this.options.selectionColumn) {
					this.events["click .selectionColumn"] = "addToSelection";
				}
			}

			this.render();			
			this.model.on("change", this.render, this);
		},
		render: function() {		
			this.$el.html(this.options.rowTemplate({model: this.model.toJSON(), options: this.options}));	
			this.$el.attr('id', this.model.id);		
		},
		events: {
			'dblclick td': 'startEditing',
			'blur .editField': 'saveField',
			'change .editField': 'saveField'
		},
		startEditing: function(e) {
			var $td = this.$(e.target).closest('td'),
				key = $td.attr('key');
			if(_.find(this.options.columns, function(col) { return col.key === key }).editable ) {
				$td.find('p').hide();
				$td.find('input').show().focus();				
			}
		},
		saveField: function(e) {
			var $td = this.$(e.target).closest('td'),
				key = $td.attr('key'), obj = {};
				
			obj[key] = this.$(e.target).val();
			this.model.set(obj);	

			$td.find('p').show();
			$td.find('input').hide();

			e.stopPropogation();
		},
		selectRow: function(e) {			
			this.options.selectedModels.reset(this.model);
		},
		addToSelection: function(e) {
			this.options.selectedModels.add(this.model);	
			e.stopPropogation();
		} 
	});
	
	GridView = Backbone.View.extend({
		
		className: "gridView",
	
		initialize: function() {
			
			this.gridTemplate = _.template(GridTemplate, undefined, {variable: 'o'});
			this.rowTemplate = _.template(RowTemplate, undefined, {variable: 'o'});
			
			this.options = _.extend({
				autoRenderRows: true,
				autoRenderNewRows: true,
				autoRemoveRows: true,
				width: 700,
				height:200,
				logRenderTime: false,
				selection: true,
				selectionColumn: false,
				selectedModels: new Backbone.Collection(),
			}, this.options);

			this.options.selectedModels.on('all', this.updateSelection, this);
			this.collection.on('add', this.buildRow, this);
		},

		updateSelection: function() {
			var scope = this;
			this.$('tr').removeClass('selected');
			this.$('.selectionColumn').prop('checked', false);
			this.options.selectedModels.each(function(model, i) {
				scope.$('#'+model.id).addClass('selected').find('.selectionColumn').prop('checked', true);
			});
		},
		
		render: function() {
			var time = new Date().getTime();		
			this.$el.html(this.gridTemplate({options: this.options}));
			this.buildGrid();
			if(this.options.logRenderTime) console.log("Render time (ms)", (new Date().getTime()) - time);	
		},
		
		buildGrid: function() {
			var $gvGrid = this.$('.gvGrid').html("").hide();

			this.collection.each(this.buildRow, this);
			$gvGrid.show();
			
			if(this.options.onRender) this.options.onRender.call(this);
		},
		
		buildRow: function(model, i) {			
			var rowView = new RowView(_.extend(this.options, 
				{model: model, rowTemplate: this.rowTemplate}
			));
			this.$('.gvGrid').append(rowView.el);
		}
		
	});
	
	return GridView;
	
});
