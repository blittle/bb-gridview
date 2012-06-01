define(
	["backbone","underscore", 'text!templates/grid.html', 'text!templates/row.html'],
function( Backbone ,_ ,GridTemplate, RowTemplate) {
	
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

			e.stopPropagation();
		},
		selectRow: function(e) {			
			this.options.selectedModels.reset(this.model);
		},
		addToSelection: function(e) {
			if(this.options.selectedModels.get(this.model.id)) {
				this.options.selectedModels.remove(this.model);	
			} else {
				this.options.selectedModels.add(this.model);		
			}
			
			e.stopPropagation();
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

			if(this.options.externalFilter) {
				this.options.externalFilter.keydown(_.bind(this.startSearch, this));
			}
		},

		startSearch: function(e) {
			if(this.timeout) clearTimeout(this.timeout);
			this.timeout = setTimeout(_.bind(this.buildGrid, this),300);
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

			this.$el.attr('unselectable', 'on')
               .css({
                   '-moz-user-select':'none',
                   '-webkit-user-select':'none',
                   'user-select':'none',
                   '-ms-user-select':'none'
               })
               .each(function() {
                   this.onselectstart = function() { return false; };
               });
		},
		
		buildGrid: function() {
			var $gvGrid = this.$('.gvGrid').html("").hide(),
				searchVal = '', scope = this;

			if(this.options.externalFilter) searchVal = this.options.externalFilter.val();

			_.each( this.findModels(searchVal), _.bind(scope.buildRow, scope) );

			$gvGrid.show();
			
			if(this.options.onRender) this.options.onRender.call(this);
		},

		findModels: function(searchVal) {
			var scope = this;

			return _.filter(scope.collection.models, function(model) {
				if(searchVal === '') return true;
				for(var col in scope.options.columns) {
					if((model.attributes[scope.options.columns[col].key]+'').indexOf(searchVal+'') !== -1) return true;
				}
				return false;
			});
		},
		
		buildRow: function(model, i) {			
			var rowView = new RowView(_.extend(this.options, 
				{model: model, rowTemplate: this.rowTemplate}
			));
			this.$('.gvGrid').append(rowView.el);
		},

		events: {
			'click .selectAll': 'selectAll'
		},

		selectAll: function(e) {
			var selectAll = this.$(e.target).prop('checked');
			
			if(selectAll) {
				this.$('.selectionColumn').prop('checked', true).closest('tr').addClass('selected');
				this.options.selectedModels.reset(this.collection.models, {silent: true});
			} else {
				this.$('.selectionColumn').prop('checked', false).closest('tr').removeClass('selected');
				this.options.selectedModels.reset([], {silent: true});
			}
		}
		
	});
	
	return GridView;
	
});
