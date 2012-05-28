define(["backbone", "underscore", "gridView"], function(Backbone, _, GridView) {
	
	"use strict";

	var leftView, rightView, testView;

	testView = Backbone.View.extend({

		initialize: function() {
			this.examples = this.collection;
			this.activeExample = new Backbone.Model({index: 0});
			this.activeExample.on("change", this.displayExample, this);
		},

		render: function() {
			var that = this;

			this.$el.html("<div id='left'/><div id='right'><h1>BackboneJS GridView</h1></div>");

			this.examples.each(function(example, i) {
				example = example.toJSON();
				that.$('#left').append('<a id="' + i + '">' + example.title + '</a><br>');
			});

			this.$('#right').width($(window).width() - 200);

			this.delegateEvents();
		},

		displayExample: function(index, options) {
			var example = this.examples.at(index.get('index')).toJSON(),
				$right = this.$('#right');
			
			$right.html("<h1>" + example.title + "</h1>");
			$right.append("<p>" + example.description + "</p>");
			$right.append("<pre><code>"+ _.escape(example.code) + "</code></pre><div id='example'/>");
			eval(example.code);
		},

		events: {
			"click a" : "changeExample"
		},

		changeExample : function(e) {
			var index = this.$(e.target).attr('id');
			this.activeExample.set({index: index});
		}

	});

	return testView;
});