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

      delete self.data.bridge['N/A'];
      delete self.data.nonBridge['N/A'];

      self.dataNonBridge = self.data.nonBridge;
      self.dataBridge = self.data.bridge;


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
        drawToolTipHTML(svgContainer, bar[0][i].children[0], i, d);
      })
      .on('mouseleave', function(d,i) {
        removeToolTipHTML(svgContainer, bar[0][i].children[0]);
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
      .attr('y', margin.top + h + 3*tickSize)
      .text(function(d,i) {
        if (barWidth >= 30 || i % 2 === 0)
          return d.abbr;
        else
          return '\xA0\xA0';})
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'hanging')
      .style('dominant-baseline', 'hanging')
      .on('mouseover', function(d,i) {
        drawToolTipHTML(svgContainer, bar[0][i].children[0], i, d);
      })
      .on('mouseleave', function(d,i) {
        removeToolTipHTML(svgContainer, bar[0][i].children[0]);
      });

    //Now the ticks are built, the legend of the x axis is added
    var barBbox = bar[0][0].getBBox();
    d3.select(svgContainer + ' #xAxisLegend')
      .attr('y', barBbox.y + barBbox.height + 4*tickSize);
  }

  Histogram.prototype.drawChart = function(container, params) {
    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        title = params.title || 'noTitle',
        data = this[params.dataName] || this.data,
        margin = params.margin || this.defaultMargin,
        tickSize = params.tickSize || this.defaultTickSize,
        nbCountries = params.nbCountries || 30;

    var chartTrueHeight = height - (margin.top + margin.bottom),
        chartTrueWidth = width - (margin.left + margin.right);

    var nbKeysData = Object.keys(data).length;
    var dataArray = Object.keys(data).sort(function(a,b) {
                      return data[b].nb - data[a].nb;
                    }).map(function(e, i) {
                      return {x: i, y: data[e].nb, country: e, abbr: data[e].abbr};
                    }).slice(0, nbCountries-1);
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
      .ticks(1)
      .tickValues([0, 100])
      .tickFormat(function(d, i) {
        if (i === 1)
          return d3.max(dataArray, function(d) { return d.y; });
      })
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
      .attr('y', chartTrueHeight + margin.top + 2 * tickSize)
      .attr('id', 'xAxisLegend')
      .style('text-anchor', 'middle')
      .style('alignment-baseline', 'hanging')
      .style('dominant-baseline', 'hanging')
      .text('Countries');
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 7*tickSize)
      .attr('x', 0 - (margin.top + chartTrueHeight/2))
      .attr('id', 'yAxisLegend')
      .style('alignment-baseline', 'baseline')
      .style('dominant-baseline', 'baseline')
      .style('text-anchor', 'middle')
      .text('Participations');

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

  function removeToolTipHTML(container, bar) {
    d3.selectAll('.histoBridgeTooltipContainer').remove();

    var elemHoverBar = document.querySelectorAll('.hoverBar');
    for (var i = 0; i < elemHoverBar.length; i++) {
      var e = elemHoverBar[i];
      e.setAttribute('class', e.getAttribute('class').replace(/ hoverBar/, ''));
    }

  }

  function drawToolTipHTML(component, bar, id, data, complementary) {
    if (complementary === undefined || complementary.slave === undefined)
      findCountryBarInOtherGraph(component, data.country);
    var country = data.country;
    var trueSvgPositions = document.getElementById(component.replace('#',''))
                  .getBoundingClientRect();

    //Remove the possibly existing tooltip
    d3.select('#histoBridgeTooltipContainer_' + component.replace('#','')).remove();

    //Enables the styling with the hover
    bar.setAttribute("class", bar.getAttribute("class")+ ' hoverBar');

    var powerLawTooltipLegend = data.country + ': ' +
                            data.y +
                            (data.y > 1 ? ' participations' :
                                          ' participation'),
        boundingRectBar = bar.getBBox(),
        paddingText = {top: 5, left: 5};

    var trueY = data.chapterName !== undefined ?
                  + bar.getAttribute('transform')
                     .replace(/translate\(\d*,/,'').replace('\)','') :
                  0;
    d3.select('body')
      .append('div')
      .attr('id', 'histoBridgeTooltipContainer_' + component.replace('#',''))
      .attr('class', 'histoBridgeTooltipContainer')
      .append('div')
      .attr('class', 'histoBridgeTooltipText tooltipText')
      .attr('id', 'histoBridgeTooltipText_' + component.replace('#',''))
        .style('position', 'absolute')
        .style('padding', paddingText.top + 'px ' + paddingText.left + 'px')

    d3.select('#histoBridgeTooltipText_' + component.replace('#',''))
      .text(powerLawTooltipLegend);

    var svgBbox = d3.select(component)[0][0].getBBox(),
        xMax = svgBbox.x + svgBbox.width,
        xMin = svgBbox.x;

    //Here we create an arrow of the given side
    var arrowSide = 8;
    d3.select('#histoBridgeTooltipContainer_' + component.replace('#',''))
      .append('div')
      .attr('id', 'arrowTooltip')
      .style('position', 'absolute')
      .style('width', 0)
      .style('height', 0)
      .style('border-left', arrowSide + 'px solid transparent')
      .style('border-right', arrowSide + 'px solid transparent')
      .style('border-top', arrowSide + 'px solid rgba(51, 97, 109, 0.8)')
      .style('left', boundingRectBar.x +
                     boundingRectBar.width/2 -
                     arrowSide + trueSvgPositions.left + 'px')
      .style('top', boundingRectBar.y + trueSvgPositions.top + trueY - arrowSide + 'px')


    //Text in the tooltip horizontal alignement if out of the svg on the right
    var tooltipWidth = document.getElementById('histoBridgeTooltipText_' + component.replace('#','')).clientWidth -
                       2 * paddingText.left,
        tooltipHeight = document.getElementById('histoBridgeTooltipText_' + component.replace('#','')).clientHeight -
                       2 * paddingText.top,
        xFinalText = boundingRectBar.x + boundingRectBar.width/2 +
                     tooltipWidth/2,
        xStartText = boundingRectBar.x + boundingRectBar.width/2 -
                     tooltipWidth/2;

    if (xFinalText >= xMax )
      d3.select('#histoBridgeTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + xStartText - (xFinalText - xMax) + 'px')
    else if (xStartText <= xMin)
      d3.select('#histoBridgeTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + xMin + 'px')
    else
      d3.select('#histoBridgeTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + Math.round(boundingRectBar.x +
                        boundingRectBar.width/2 - tooltipWidth/2) + 'px');

    d3.select('#histoBridgeTooltipText_' + component.replace('#',''))
      .style('top', trueSvgPositions.top + boundingRectBar.y + trueY -
                    tooltipHeight - 2*arrowSide - 2 + 'px');
  }

  function findCountryBarInOtherGraph(component, country, complementary) {
    var complementGraph;
    if (component.search('Non') !== -1)
      complementGraph = component.replace('Non', '');
    else
      complementGraph = component.replace('Bridge', 'NonBridge');

    var index = -1,
        dataArray = d3.select(complementGraph).selectAll('g.bar').data();
    for (var i = 0; i < dataArray.length && index === -1; i++) {
      var d = dataArray[i];
      if (d.country === country)
        index = i;
    }
    var trueSvgPositions = document.getElementById(complementGraph.replace('#',''))
                      .getBoundingClientRect();
    if (index !== -1)
      drawToolTipHTML(complementGraph,
                      d3.select(complementGraph).selectAll('.bar').selectAll('rect')[index][0],
                      index,
                      dataArray[index],
                      {
                        slave: true
                      });
  }

  // Exporting
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = Histogram;
    exports.countryPartBridgenonBridge = Histogram;
  } else if (typeof define === 'function' && define.amd)
    define('countryPartBridgenonBridge', [], function() {
      return Histogram;
    });
  else
    this.countryPartBridgenonBridge = Histogram;
}).call(this);
