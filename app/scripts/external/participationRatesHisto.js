(function(undefined) {
  'use strict';

  /**
   * MEDEA Power-law Histogram Viz
   * ==============================
   *
   * Load the participations.json file and display the three
   * relevant histograms.
   */
  function Histogram() {
    // Properties
    this.data = null;
    this.dataNonBridge = null;
    this.dataBridge = null;
    this.defaultWidth = 400;
    this.defaultHeight = 200;
    this.defaultBarWidth = 15;
    this.defaultMargin = {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40
    };
    this.defaultTickSize = 2;
  }

  Histogram.prototype.getNbParticipations = function(array) {
    var objectToReturn = {};
    array.forEach(function(element) {
      if (objectToReturn[element.count] === undefined)
        objectToReturn[element.count] = 1;
      else
        objectToReturn[element.count]++;
    });
    return objectToReturn;
  }

  Histogram.prototype.load = function(path, callback) {
    var self = this;
    d3.json(path, function(participations) {
      self.data = participations;

      self.dataNonBridge = self.getNbParticipations(
        self.data.filter(function(d) {
          return !d.bridge;
        })
      );
      self.dataBridge = self.getNbParticipations(
        self.data.filter(function(d) {
          return d.bridge;
        })
      );

      self.data = self.getNbParticipations(self.data);

      var maxPart = d3.max(Object.keys(self.data), function(d) {return +d;}),
          minPart = d3.min(Object.keys(self.data), function(d) {return +d;});

      for (var i = minPart; i <= maxPart; i++) {
        if (self.data[i] === undefined)
          self.data[i] = 0;

        if (self.dataNonBridge[i] === undefined)
          self.dataNonBridge[i] = 0;

        if (self.dataBridge[i] === undefined)
          self.dataBridge[i] = 0;
      }

      if (typeof callback === 'function')
        callback();
    });
  }

  Histogram.prototype.drawBars = function(data, params) {

    var scaleX = params.scaleX,
        scaleY = params.scaleY,
        svgContainer = params.svgContainer,
        distanceBarToTick = 2,
        h = params.height,
        w = params.width - 1,
        name = params.name || '',
        margin = params.margin,
        tickSize = params.tickSize,
        barWidth = (w - data.length * 2 * distanceBarToTick) / data.length;

    var scaleY = scaleY.domain([0, d3.max(data, function(d) { return d.y; })]);

    var bar = d3.select(svgContainer).selectAll('.bar '+ name)
        .data(data)
        .enter().append('g')
        .attr('class', 'bar ' + name);


    bar.append('rect')
      .attr('x', function(d,i) {
        return (margin.left +
                1 +
                i * (barWidth + 2*distanceBarToTick) +
                distanceBarToTick);
      })
      .attr('y', function(d) { return margin.top + scaleY(d.y) - tickSize; })
      .attr('width', barWidth)
      .attr('height', function(d) {return (h - scaleY(d.y)); });

    bar.append('rect')
      .attr('x', function(d,i) {
        return (margin.left +
                1 +
                i * (barWidth + 2*distanceBarToTick) +
                distanceBarToTick);
      })
      .attr('y', function(d) { return margin.top - tickSize; })
      .attr('width', barWidth)
      .attr('height', function(d) { return h; })
      .attr('class', 'invisible')
      .on('mouseover', function(d,i) {
        drawToolTip(svgContainer, bar[0][i], i, d);
      })
      .on('mouseleave', function(d,i) {
        removeToolTip(svgContainer, bar[0][i]);
      });

    /**
     * Draws the ticks on the x axis
     */
    bar.append('line')
      .attr('x1', function(d,i) {
        return (margin.left + 1 + (i+1) * (barWidth + 2 * distanceBarToTick))
      })
      .attr('x2', function(d,i) {
        return (margin.left + 1 + (i+1) * (barWidth + 2 * distanceBarToTick))
      })
      .attr('y1', margin.top + h - tickSize )
      .attr('y2', margin.top + h + tickSize)
      .style('shape-rendering', 'crispEdges')
      .attr('stroke-width', 1)
      .attr('stroke', 'black');

    bar.append('text')
      .attr('x', function(d,i) {
        return (margin.left +
                1 +
                i * (barWidth + 2*distanceBarToTick) +
                distanceBarToTick +
                barWidth / 2);
      })
      .attr('y', margin.top + h + 2*tickSize)
      .text(function(d,i) {
        if (barWidth >= 14 || i % 2 !== 0)
          return d.x;
        else
          return '\xA0\xA0';})
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'hanging')
      .on('mouseover', function(d,i) {
        drawToolTip(svgContainer, bar[0][i], i, d);
      })
      .on('mouseleave', function(d,i) {
        removeToolTip(svgContainer, bar[0][i]);
      });

    //Now the ticks are built, the legend of the x axis is added
    var barBbox = bar[0][0].getBBox();
    d3.select(svgContainer + ' #xAxisLegend')
      .attr('y', barBbox.y + barBbox.height + tickSize);
  }

  Histogram.prototype.drawChart = function(container, params) {
    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        title = params.title || 'noTitle',
        data = this[params.dataName] || this.data,
        margin = params.margin || this.defaultMargin,
        tickSize = params.tickSize || this.defaultTickSize;

    var chartTrueHeight = height - (margin.top + margin.bottom),
        chartTrueWidth = width - (margin.left + margin.right);

    var nbKeysData = Object.keys(data).length;
    var dataArray = Object.keys(data).map(function(e) {
                      return {x: +e, y: data[e]};
                    });
    /**
     * Scales
     */
    var x = d3.scale.linear()
            .range([0, chartTrueWidth])
            .domain([0, d3.max(dataArray, function(d) { return d.x; })]),
        y = d3.scale.linear()
              .range([chartTrueHeight, 0]);

    /**
     * Axes definition
     */
    //Creates the y Axis ranging from 0 to 100 (100 on top)
    var yAxis = d3.svg.axis()
      .scale(d3.scale.linear().range([chartTrueHeight, 0]).domain([0, 100]))
      .tickSize(tickSize)
      .orient('left');

    //Creates the x Axis ranging from 0 to 100 (100 on top)
    var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .orient('bottom');

    d3.select(container + ' svg').remove();

    //Creates the chart component inside
    var chart = d3.select(container)
      .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', params.dataName)
        .attr('class', 'powerLawHisto');

    //Adds the axes
    chart.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .attr('id', 'yAxis')
      .call(yAxis);
    chart.append('g')
      .attr('class', 'axis')
      .attr('id', 'xAxis')
      .attr('transform', 'translate(' + margin.left + ', ' + (chartTrueHeight + margin.top)+ ')')
      .call(xAxis);

    //Adds the Title label
    chart.append('text')
      .attr('x', margin.left + (chartTrueWidth / 2))
      .attr('y', margin.top/1.1)
      .attr('class', 'title')
      .style('text-anchor', 'middle')
      .text(title);

    //Adds the axis labels
    chart.append('text')
      .attr('x', margin.left + (chartTrueWidth / 2))
      .attr('y', chartTrueHeight + margin.top + tickSize)
      .attr('id', 'xAxisLegend')
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'hanging')
      .text('Number of participations');
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 4*tickSize)
      .attr('x', 0 - (margin.top + chartTrueHeight/2))
      .style('alignment-baseline', 'baseline')
      .style('text-anchor', 'middle')
      .text('Number of authors');

    this.drawBars(dataArray,{
                         scaleX: x,
                         scaleY: y,
                         svgContainer: '#' + params.dataName,
                         height: chartTrueHeight,
                         width: chartTrueWidth,
                         margin: margin,
                         tickSize: tickSize
                       });
    return chart;
  }

  function removeToolTip(container, bar) {
    d3.select(container + ' .powerLawTooltipContainer').remove();

    //For the case where it is the axis that is hovered
    if (bar.getAttribute('height') === null && bar.getAttribute('class').indexOf('bar') > -1) {
      bar = bar.childNodes[0];
    }

    bar.setAttribute("class", bar.getAttribute("class").replace(/ hoverBar/, ''));
  }

  function drawToolTip(component, bar, id, data, complementary) {
    //Remove the possibly existing powerLawTooltip
    d3.select(component + ' .powerLawTooltipContainer').remove();

    //For the case where it is the axis that is hovered
    if (bar.getAttribute('height') === null && bar.getAttribute('class').indexOf('bar') > -1) {
      bar = bar.childNodes[0];
    }

    //Enables the styling with the over
    bar.setAttribute("class", bar.getAttribute("class")+ ' hoverBar');

    var powerLawTooltipLegend = data.y + (data.y > 1 ? ' authors' : ' author'),
        boundingRectBar = bar.getBBox(),
        paddingText = {top: 5, left: 5};


    d3.select(component).append('g')
      .attr('class', 'powerLawTooltipContainer')
      .append('g')
      .attr('id', 'powerLawTooltip');
    d3.select(component + ' .powerLawTooltipContainer')
      .append('g')
      .attr('id', 'powerLawTooltipText');


    //Text in the powerLawTooltip creation + horizontal alignment
    d3.select(component + ' .powerLawTooltipContainer #powerLawTooltipText')
      .append('text')
        .attr('x', boundingRectBar.x + boundingRectBar.width/2)
        .style('text-anchor', 'middle')
        .text(powerLawTooltipLegend);
    var boundingRectText = d3.select(component + ' #powerLawTooltipText text')[0][0].getBBox();

    var downArrowWidth = boundingRectText.width/1.7;
    //Text in the powerLawTooltip vertical alignment
    d3.select(component + ' #powerLawTooltipText text')
      .attr('y', boundingRectBar.y - 2*Math.sqrt(downArrowWidth) - paddingText.top )
      .style('alignment-baseline', 'baseline');
    boundingRectText = d3.select(component + ' #powerLawTooltipText text')[0][0].getBBox();

    // Small arrow of the powerLawTooltip
    d3.select(component + ' .powerLawTooltipContainer #powerLawTooltip')
      .append('path')
        .attr('d', d3.svg.symbol().type('triangle-down').size(downArrowWidth))
        .attr('transform',
              'translate(' +
                (boundingRectBar.x + boundingRectBar.width/2) + ',' +
                (boundingRectBar.y - Math.sqrt(downArrowWidth)/2) + ')');

    //Creates the "box" containing the text
    d3.select(component + ' .powerLawTooltipContainer #powerLawTooltip')
      .append('rect')
        .attr('y', boundingRectText.y - paddingText.top)
        .attr('x', boundingRectText.x - paddingText.left)
        .attr('height', boundingRectText.height + 2 * paddingText.top)
        .attr('width', boundingRectText.width + 2 * paddingText.left);



    //Enables the text to be above the rect
    d3.select(component + ' .powerLawTooltipContainer')
      .sort(function(a, b) {
        if (a.id === 'powerLawTooltip' && b.id === 'powerLawTooltipText')
          return 1;
        else if (b.id === 'powerLawTooltip' && a.id === 'powerLawTooltipText')
          return -1;
        else
          return 0;
      });

  }


  // Exporting
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = Histogram;
    exports.PowerLawHistogram = Histogram;
  } else if (typeof define === 'function' && define.amd)
    define('PowerLawHistogram', [], function() {
      return Histogram;
    });
  else
    this.PowerLawHistogram = Histogram;
}).call(this);
