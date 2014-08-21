/** This chart is used to draw horizontal bar chart label position, direction ,spacingBetweenBars, width of the bars can be adjusted
 * A D3 horizontalBar Chart
 *
 * @class HorizontalBarChartComponent
 * @namespace App
 * @extends Ember.Component
 * @module components
 * global d3
 */
 App.HorizontalBarChartComponent = Ember.Component.extend({
  tagName: 'svg',
  attributeBindings:  'width height'.w() ,

  /**
   * The chart data (e.g. AdapterPopulatedRecordArray)
   *
   * @property data
   * @type {Object[]}
   */
   data: undefined,

   valueField: 'value',

   nameField: 'name',

   /**
   * @property spacingBetweenBars
   * @type number
   */
   spacingBetweenBars: 20,

   /**
   * @property barHeight
   * @type number
   */
   barHeight: 5,


   /**
   * @property direction
   * @type String
   */
   direction: 'left',

   draw: function () {
    var nameField = this.get('nameField'),
    valueField = this.get('valueField'),
    data = this.get('data').toArray(),
    width = this.$().width(),
    color = this.get('color'),
    spacingBetweenBars = Number(this.get('spacingBetweenBars')),
    barHeight = Number(this.get('barHeight')),
    direction = this.get('direction');

    d3.select("#"+this.get('elementId')).selectAll("*").remove(); // remove content for redrawing
    if (data.get('length') === 0) {
      return;
    }
    var maxDomain = d3.max(data.map(function(d) {
      return Ember.get(d, valueField);
    }));
    var dummyWidth = width;
    if(direction==='right') {
      dummyWidth=width-Math.floor(width/3);
    }
    var scale = d3.scale.linear()
    .domain([0,maxDomain])
    .range([0, dummyWidth]);

    var maxWidth = Number(scale(maxDomain));

    var svg = d3.select("#"+this.get('elementId'));

    var chart = svg
    .attr("width", width)
    .attr("height", (barHeight+spacingBetweenBars)* (data.length+1));

    var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate("+0+"," + (i+1) * (barHeight+spacingBetweenBars) + ")"; });

    if(direction==='right') {
       bar.append("rect")
      .attr("width", function(d) {
        return scale(Ember.get(d, valueField));
      })
      .attr("height", barHeight - 1)
      .attr("transform", function(d) { return "translate("+(maxWidth-scale(Ember.get(d, valueField)))+","+0+")"; })
      .style("fill", color);
    }
    else {
       bar.append("rect")
      .attr("width", function(d) {
        return scale(Ember.get(d, valueField));
      })
      .attr("height", barHeight - 1)
      .style("fill", color);
    }

    if(this.get('label')==='right') {
       bar.append("text")
      .attr("x", maxWidth+5)
      .attr("y", barHeight/2)
      .text(function(d) { return Ember.get(d, nameField);});
    }
    else {
      bar.append("text")
      .attr("x", 0)
      .attr("y", -5)
      .text(function(d) { return Ember.get(d, nameField);});

    }

  }.on('didInsertElement').observes('data')
});
