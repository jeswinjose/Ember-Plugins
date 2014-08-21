/**
 * A D3 Donut Chart
 *
 * @class DonutChartComponent
 * @namespace App
 * @extends Ember.Component
 * @module components
 * global d3
 */
App.DonutChartComponent = Ember.Component.extend({
  tagName: 'svg',
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
   * The chart data (e.g. AdapterPopulatedRecordArray)
   *
   * @property data
   * @type Object[]
   */
  data: undefined,

  valueField: 'value',
  nameField: 'name',

  draw: function () {
    var nameField = this.get('nameField'),
        valueField = this.get('valueField'),
        data = this.get('data').toArray(),
        width = this.$().width(),
        height = this.$().height(),
        color = d3.scale.category20(), //pick random colours
        radius = Math.min(width, height) / 2-30;

    d3.select("#"+this.get('elementId')).selectAll("*").remove(); // remove content for redrawing
    if (data.get('length') === 0) {
      return;
    }

    var arc = d3.svg.arc()
      .innerRadius(radius - 40)
      .outerRadius(radius - 10);

    var pieLayout = d3.layout.pie()
      .value(function(d) { return Ember.get(d, valueField); })
      .sort(null);

    var svg = d3.select("#"+this.get('elementId'));
    var trleft = width/2-30;

    var svgChart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + trleft + "," + height / 2 + ")");

    // draw the chart
    var path = svgChart.selectAll("path")
      .data(pieLayout(data))
      .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc);

    //add the title tag for mouse over
    path.append("title")
      .text(function(d) { return Ember.get(d.data, nameField); });

    // add legends on the right side of the chart
    var legend = svg.append("g")
      .attr("height", 100)
      .attr("width", 100);


    legend.selectAll('rect')
      .data(data)
      .enter()
      .append("rect")
    .attr("x", width - 95)
    .attr("y", function(d, i){ return (i+1) *  25;})
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d,i) {
        return color(i);
    });

    legend.selectAll('text')
      .data(data)
      .enter()
      .append("text")
    .attr("x", width - 82)
    .attr("y", function(d, i){ return (i+1) *  25 + 9;})
    .text(function(d) {
        var text =  Ember.get(d, nameField);
        return text;
    });



  }.on('didInsertElement').observes('data')
});
