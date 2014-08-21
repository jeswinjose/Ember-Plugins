/**
 * A D3 bubble chart
 *
 * @class BubbleChartComponent
 * @namespace App
 * @extends Ember.Component
 * @module components
 * global d3
 */
App.BubbleChartComponent = Ember.Component.extend({
  tagName: 'svg',
  classNames: ['bubble-chart'],
  attributeBindings:  'width height'.w() ,

  /**
   * @property width
   * @type Number
   */
  width: 400,

  /**
   * @property width
   * @type Number
   */
  height: 300,

  /**
   * @property color
   * @type String
   */
  color: '#7bc6ff',

  /**
   * Spacing between bubbles
   *
   * @type Number
   */
  padding: 2,

  /**
   * The chart data (e.g. AdapterPopulatedRecordArray)
   *
   * @property data
   * @type {Object[]}
   */
  data: undefined,

  valueField: 'value',
  nameField: 'name',
  groupField: 'group',
  childrenField: 'children',

  draw: function () {
    var nameField = this.get('nameField'),
        valueField = this.get('valueField'),
        childrenField = this.get('childrenField'),
        data = this.get('data').toArray(),
        width = this.$().width(),
        height = this.$().height(),
        getColor = d3.scale.linear()
                  .domain([0, 60])
                  .range(['#FFFFFF', this.get('color')]);

    d3.select("#"+this.get('elementId')).selectAll("*").remove(); // remove content for redrawing
    if (data.get('length') === 0) {
      return;
    }

    d3.format(",d"); // use commas e.g. 10,000

    var bubbleLayout = d3.layout.pack();

    bubbleLayout
      .sort(function() { return Math.random() > 0.5; })
      .children(function (d) { return Ember.get(d, childrenField); })
      .value(function (d) { return Ember.get(d, valueField); })
      .size([width, height]) // chart dimensions
      .padding(this.get('padding'));

    var svg = d3.select("#"+this.get('elementId'));

    var node = svg.selectAll(".node")
      .data(bubbleLayout.nodes({children: data })
        .filter(function (d) { return !Ember.get(d, childrenField); })
      )
      .enter()
        .append("g")
          .attr("class", "node")
          .attr("transform",
            function(d) { return "translate(" + d.x + "," + d.y + ")";
          });

    //add the title tag for mouse over
    node.append("title")
        .text(function(d) { return Ember.get(d, nameField); });

    // draw a bubble
    node
      .append("circle")
      .attr("r", function(d) {
        return d.r;
      })
      .style("fill", function(d) {
        return getColor(d.r);
      });


    // draw the label
    node.append("text")
      .attr("dy", ".3em")
      .style("font-size", function(d) { return d.r / 4 + "px"; })
      .style("text-anchor", "middle")
      .text(function(d) {
        return Ember.get(d, nameField).substring(0, d.r / 4.5);
      });

    // rebind data
    svg.data(data).selectAll("circle")
        .data(bubbleLayout.nodes({children: data }));

    // transition chart
    node.transition()
        .duration(1300)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", function(d) { return d.r; });


  }.on('didInsertElement').observes('data')
});
