(function(undefined) {
  'use strict';

  /**
   * MEDEA Power-law LineChart Viz
   * ==============================
   *
   * Load the participations.json file and display the three
   * relevant histograms.
   */
  function LineChart() {
    // Properties
    this.data = null;
    this.defaultWidth = 400;
    this.defaultHeight = 200;
    this.defaultLineWidth = 15;
    this.defaultDataName = 'CA';
    this.defaultMargin = {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40
    };
  }

  LineChart.prototype.load = function(folderPath, callback) {
    var self = this,
        files = {
          'total': 'total_participations_by_ar_wmo_region.csv',
          'CA': 'total_participations_by_ar_wmo_region_CA.csv',
          'others': 'total_participations_by_ar_wmo_region_withoutCA.csv'
        },
        percentageMax = 0;

    d3.csv(folderPath + files.CA, function(error, data) {
      self.data = {};
      self.data.CA = data;
      self.data.CA.forEach(function(d) {
        d.wmo         = d['WMO Symbol'];
        d.percentage  = d['% WMO Region Participations'];
        if ((+d.percentage) > percentageMax)
          percentageMax = (+d.percentage);
      });

      self.data.CA = self.data.CA.filter(function(d) {
        return d.wmo != 'WMONA';
      });

      d3.csv(folderPath + files.others, function(error, dataO) {
        self.data.others = dataO;
        self.data.others.forEach(function(d) {
          d.wmo         = d['WMO Symbol'];
          d.percentage  = d['% WMO Region Participations'];

          if ((+d.percentage)> percentageMax)
            percentageMax = (+d.percentage);
        });

        self.data.others = self.data.others.filter(function(d) {
          return d.wmo != 'WMONA';
        });
        self.percentageMax = percentageMax;
        if (typeof callback === 'function')
          callback();
      });
    });
  };

  LineChart.prototype.drawChart = function(container, params) {
    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        title = params.title || '',
        dataName = params.dataName || this.defaultDataName,
        data = this.data[dataName],
        margin = params.margin || this.defaultMargin,
        colorRange = {
          'EUR': '#315b66',
          'NAC': '#44a3c7',
          'SWP': '#953a24',
          'ASI': '#d7832e',
          'AFR': '#cccf5f',
          'SAM': '#5bae66'
        };

    var chartTrueHeight = height - (margin.top + margin.bottom),
        chartTrueWidth = width - (margin.left + margin.right);

    var xFormatter = d3.format("d");

    /**
     * Scales
     */
    var x = d3.time.scale()
            .range([0, chartTrueWidth]),
        y = d3.scale.linear()
              .range([chartTrueHeight, 0]);

    /**
     * Axes definition
     */
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(
      function(d) {
        return 'AR' + xFormatter(d);
      }),
      yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
      .x(function(d) { return x(d.AR); })
      .y(function(d) { return y(d.percentage); });

    d3.select(container + ' svg').remove();
    // Create svg
    var svg = d3.select(container).append("svg")
        .attr('width', width)
        .attr('height', height)
        .attr('id', container.replace('#','') + 'Svg')
        .attr('class', 'lineChart');

    var color = d3.scale.ordinal()
      .domain(d3.set(data.map(function(d) { return d.wmo })).values());

    var continents = color.domain().map(function(wmo) {
      return {
        wmo: wmo,
        values: data.filter(function(d) { return d.wmo == wmo }).map(function(d) {
          return {AR: d.AR, percentage: d.percentage};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.AR; }));

    y.domain([
      d3.min(continents, function(d) { return d3.min(d.values, function(e) { return +e.percentage; }); }),
      this.percentageMax
    ]);

    // Add graph to svg
    svg.append("g")
        .attr("class", "x axis")
        .attr('transform', 'translate(' + margin.left + ', ' + (chartTrueHeight + margin.top)+ ')')
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .call(yAxis)
      .append("text")
        .attr('id', 'yAxisLegend')
        .attr("transform", "rotate(-90)")
        .attr("x", -(chartTrueHeight/2))
        .attr('y', -(margin.left/1.5))
        .style('alignment-baseline', 'baseline')
        // .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("Participations (%)");

    //Viz title
    svg.append('text')
      .attr('x', margin.left + (chartTrueWidth / 2))
      .attr('y', margin.top/2)
      .attr('class', 'title')
      .style('text-anchor', 'middle')
      .text(title);

    // Add lines to svg
    var continent = svg.selectAll(".continent")
        .data(continents)
      .enter().append("g")
        .attr("class", "continent");

    continent.append("path")
        .attr("class", "vizline")
        .attr("d", function(d) { return line(d.values); })
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .style("stroke", function(d) { return colorRange[d.wmo]; })
        .style("opacity", 1);

    // continent.append("text")
    //     .datum(function(d) { return {wmo: d.wmo, value: d.values[d.values.length - 1]}; })
    //     .attr("transform", function(d) { return "translate(" + (margin.left + x(d.value.AR)) + "," + (margin.top + y(d.value.percentage)) + ")"; })
    //     .attr("x", 3)
    //     .attr("dy", ".35em")
    //     .text(function(d) { return d.wmo; });

    // Add points to svg
    var circle = svg.selectAll(".circle")
        .data(d3.merge(continents.map(function(d){ return d.values.map(function(f){ return {AR:f.AR,percentage:f.percentage,wmo:d.wmo}; }); })))
      .enter().append("g")
        .attr("class", "circle");

    circle.append("circle")
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr("cx", function(d, i) { return x(d.AR); })
        .attr("cy", function(d, i) { return y(d.percentage); })
        .attr("r", 3)
        .style("fill", function(d) { return colorRange[d.wmo]; })
        .on('mouseover', function(d,i) {
          drawToolTipHTML(container + 'Svg', this,i, d);
        })
        .on('mouseleave', function(d,i) {
          removeToolTipHTML(container + 'Svg', this);
        });
  };

  function removeToolTipHTML(container, bar) {
    d3.selectAll('.lineTooltipContainer').remove();

    var elemHoverBar = document.querySelectorAll('.hoverLine');
    for (var i = 0; i < elemHoverBar.length; i++) {
      var e = elemHoverBar[i];
      e.setAttribute('class', e.getAttribute('class').replace(/ hoverLine/, ''));
    }

  }
  function drawToolTipHTML(component, element, id, data) {

    var country = data.country;
    var trueSvgPositions = document.getElementById(component.replace('#',''))
                  .getBoundingClientRect();

    //Remove the possibly existing tooltip
    d3.select('#lineTooltipContainer_' + component.replace('#','')).remove();

    //Enables the styling with the hover
    element.setAttribute("class", element.getAttribute("class")+ ' hoverLine');

    var powerLawTooltipLegend = data.wmo + ': ' + data.percentage +'%',
        boundingRectLine = element.getBBox(),
        paddingText = {top: 5, left: 5};


    var trueY = data.wmo !== undefined ?
                  + element.getAttribute('transform')
                     .replace(/translate\(\d*,/,'').replace('\)','') :
                  0,
        trueX = data.wmo !== undefined ?
                  + element.getAttribute('transform')
                     .replace(/translate\(/,'').replace(/,\s*\d*\)/,'') :
                  0;

    d3.select('body')
      .append('div')
      .attr('id', 'lineTooltipContainer_' + component.replace('#',''))
      .attr('class', 'lineTooltipContainer')
      .append('div')
      .attr('class', 'lineTooltipText tooltipText')
      .attr('id', 'lineTooltipText_' + component.replace('#',''))
        .style('position', 'absolute')
        .style('padding', paddingText.top + 'px ' + paddingText.left + 'px')

    d3.select('#lineTooltipText_' + component.replace('#',''))
      .text(powerLawTooltipLegend);

    var svgBbox = d3.select(component)[0][0].getBBox(),
        xMax = svgBbox.x + svgBbox.width,
        xMin = svgBbox.x;
    //Here we create an arrow of the given side
    var arrowSide = 8;
    d3.select('#lineTooltipContainer_' + component.replace('#',''))
      .append('div')
      .attr('id', 'arrowTooltip')
      .style('position', 'absolute')
      .style('width', 0)
      .style('height', 0)
      .style('border-left', arrowSide + 'px solid transparent')
      .style('border-right', arrowSide + 'px solid transparent')
      .style('border-top', arrowSide + 'px solid rgba(51, 97, 109, 0.8)')
      .style('left', boundingRectLine.x +
                     trueX +
                     boundingRectLine.width/2 -
                     arrowSide + trueSvgPositions.left + 'px')
      .style('top', boundingRectLine.y + trueSvgPositions.top + trueY - arrowSide + 'px')


    //Text in the tooltip horizontal alignement if out of the svg on the right
    var tooltipWidth = document.getElementById('lineTooltipText_' + component.replace('#','')).clientWidth -
                       2 * paddingText.left,
        tooltipHeight = document.getElementById('lineTooltipText_' + component.replace('#','')).clientHeight -
                       2 * paddingText.top,
        xFinalText = boundingRectLine.x + boundingRectLine.width/2 +
                     tooltipWidth/2,
        xStartText = boundingRectLine.x + boundingRectLine.width/2 -
                     tooltipWidth/2;

    if (xFinalText >= xMax )
      d3.select('#lineTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + xStartText - (xFinalText - xMax) + 'px')
    else if (xStartText <= xMin)
      d3.select('#lineTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + xMin + 'px')
    else
      d3.select('#lineTooltipText_' + component.replace('#',''))
        .style('left',  trueX + trueSvgPositions.left + Math.round(boundingRectLine.x +
                        boundingRectLine.width/2 - tooltipWidth/2) + 'px');

    d3.select('#lineTooltipText_' + component.replace('#',''))
      .style('top', trueSvgPositions.top + boundingRectLine.y + trueY -
                    tooltipHeight - 2*arrowSide - 2 + 'px');
  }

  // Exporting
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = LineChart;
    exports.LineChart = LineChart;
  } else if (typeof define === 'function' && define.amd)
    define('LineChart', [], function() {
      return LineChart;
    });
  else
    this.LineChart = LineChart;
}).call(this);
