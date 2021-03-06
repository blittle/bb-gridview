define(
	["backbone","underscore"],
function( Backbone ,_) {
	
	var RowView, GridView, GridTemplate, RowTemplate;

	GridTemplate = ""
	+ "<table width='<%=o.options.width%>' style='height: <%=o.options.height%>' class='gvHeader' cellspacing=0 cellpadding=0>"
		+ " <tr><% " 
		+ "	if(o.options.selectionColumn) { "
		+ "	%> "
		+ "	<td><input type='checkbox' class='selectionColumn selectAll'/></td> "
		+ "	<% "
		+ "	} "
		+ "	_.each(o.options.columns, function(column) {%> "
		+ "	<td width='<%=o.options.width / o.options.columns.length%>'><p><%=column.label%></p></td> "
		+ "	<%})%> "
		+ "</tr> "
	+ "</table> "
	+ "<div class='gridWrapper' style='width:<%=o.options.width%>px; height:<%=o.options.height%>px;'> "
	+ "	<table width='<%=o.options.width%>'cellspacing=0 cellpadding=0 class='gvGrid'/> "
	+ "</div>"
	+ "<%//@ sourceURL=GridTemplate.js%>";


	RowTemplate = ""
	+ "<% "
	+ " if(o.options.selectionColumn) { "
	+ "%> "
	+ "	<td><input class='selectionColumn' type='checkbox'/></td>"
	+ "<% "
	+ "	} "
	+ "%> "
 	+ "<%_.each(o.options.columns, function(column) { "
	+ "	var val = column.formatter ? column.formatter.call(o.model, o.model[column.key]) : o.model[column.key], "
	+ "		sClassName = column.className ? column.className : '', "
	+ "		editableField = column.editable ? '<input class=\"editField\" type=\"text\" value=\"' + o.model[column.key] + '\"/>' : '';"
	+ "%> " 
	+ "	<td class='<%-sClassName%>' key='<%-column.key%>' width='<%=o.options.width / o.options.columns.length%>'><p><%=val%></p><%=editableField%></td> "
	+ "<%});%>"
	+ "//@ sourceURL=RowTemplate.js%>";


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
			this.$el.html(this.gridTemplate({options: this.options}));
			this.buildGrid();

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
				searchVal = '', scope = this, time = new Date().getTime();

			if(this.options.externalFilter) searchVal = this.options.externalFilter.val();

			_.each( this.findModels(searchVal), _.bind(scope.buildRow, scope) );

			$gvGrid.show();
			
			if(this.options.onRender) this.options.onRender.call(this);			
			if(this.options.logRenderTime) console.log("Render time (ms)", (new Date().getTime()) - time);	
		},

		findModels: function(searchVal) {
			var scope = this,
				searchVal = scope.options.caseSensitive ? searchVal : (searchVal+'').toLowerCase();

			return _.filter(scope.collection.models, function(model) {
				if(searchVal === '') return true;

				var columns = scope.options.columns,
					attributes = model.attributes,
					value = '';

				for(var col in columns) {
					value = attributes[columns[col].key]+'';
					value = scope.options.caseSensitive ? value : value.toLowerCase();

					if(value.indexOf(searchVal) !== -1) return true;
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
