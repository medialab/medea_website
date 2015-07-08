(function(undefined) {
  'use strict';

  /**
   * MEDEA Power-law LineChartRoleOnly Viz
   * ==============================
   *
   * Load the participations.json file and display the three
   * relevant histograms.
   */
  function LineChartRoleOnly() {
    // Properties
    this.data = null;
    this.defaultWidth = 400;
    this.defaultHeight = 200;
    this.defaultLineWidth = 15;
    this.defaultMargin = {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40
    };
  }

  LineChartRoleOnly.prototype.load = function(path, callback) {
    var self = this;
    d3.json(path, function(error, data) {
      self.data = [];


      for (var ar in data) {
        for (var role in data[ar].roles) {
          var object = {
            'AR': ar,
            'Total Participations': data[ar].total,
            'Role': role,
            'participations': data[ar].roles[role],
            'percentage': data[ar].roles[role] / data[ar].total * 100
          };
          self.data.push(object);
        }
      }
      console.log('dataaaaaa', self.data);

      if (typeof callback === 'function')
        callback();
    });
  };

  LineChartRoleOnly.prototype.drawChart = function(container, params) {
    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        title = params.title || '',
        data = this.data,
        margin = params.margin || this.defaultMargin,
        colorRange = {
          'CA': '#1E6D75',
          'LA': '#EB983E',
          'RE': '#581315',
          'CLA': '#A7252A'
        };

    console.log('data', this.data)

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
        console.log('xAxis', d)
        return 'AR' + xFormatter(d);
      }),
      yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
      .x(function(d) { console.log('line', d); return x(d.AR); })
      .y(function(d) { return y(d.percentage); });

    // Create svg
    var svg = d3.select(container).append("svg")
        .attr('width', width)
        .attr('height', height)
        .attr('id', container.replace('#','') + 'Svg')
        .attr('class', 'lineChart');

    var color = d3.scale.ordinal()
      .domain(d3.set(data.map(function(d) { return d.Role })).values());

    var Roles = color.domain().map(function(Role) {
      return {
        Role: Role,
        values: data.filter(function(d) { return d.Role === Role })
          .map(function(d) {
          return {AR: d.AR, percentage: d.percentage};
        })
      };
    });

    x.domain(d3.extent(data, function(d) { return d.AR; }));

    y.domain([
      d3.min(Roles, function(d) { return d3.min(d.values, function(e) { return +e.percentage; }); }),
      d3.max(Roles, function(d) { return d3.max(d.values, function(e) { return +e.percentage; }); })
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
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Participations (%)");

    // Add lines to svg
    var Role = svg.selectAll(".Role")
        .data(Roles)
      .enter().append("g")
        .attr("class", "Role");

    Role.append("path")
        .attr("class", "vizline")
        .attr("d", function(d) { return line(d.values); })
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .style("stroke", function(d) { return colorRange[d.Role]; })
        .style("opacity", 0.6);

    Role.append("text")
        .datum(function(d) { return {Role: d.Role, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + (margin.left + x(d.value.AR)) + "," + (margin.top + y(d.value.percentage)) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.Role; });

    // Add points to svg
    var circle = svg.selectAll(".circle")
        .data(d3.merge(Roles.map(function(d){ return d.values.map(function(f){ return {AR:f.AR,percentage:f.percentage,Role:d.Role}; }); })))
      .enter().append("g")
        .attr("class", "circle");

    circle.append("circle")
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
        .attr("cx", function(d, i) { return x(d.AR); })
        .attr("cy", function(d, i) { return y(d.percentage); })
        .attr("r", 3)
        .style("fill", function(d) { return colorRange[d.Role]; })
        .on('mouseover', function(d,i) {
          console.log('mouseover', d, i);
          drawToolTipHTML(container + 'Svg', this,i, d);
        })
        .on('mouseleave', function(d,i) {
          removeToolTipHTML(container + 'Svg', this);
        });;
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
    console.log('component', component);
    var country = data.country;
    var trueSvgPositions = document.getElementById(component.replace('#',''))
                  .getBoundingClientRect();

    //Remove the possibly existing tooltip
    d3.select('#lineTooltipContainer_' + component.replace('#','')).remove();

    //Enables the styling with the hover
    element.setAttribute("class", element.getAttribute("class")+ ' hoverLine');

    var powerLawTooltipLegend = data.Role + ': ' + data.percentage.toFixed(2) +'%',
        boundingRectLine = element.getBBox(),
        paddingText = {top: 5, left: 5};
        console.log('heyehy', boundingRectLine)


    console.log(element.getAttribute('transform'))
    console.log(element.getAttribute('transform'))
    var trueY = data.Role !== undefined ?
                  + element.getAttribute('transform')
                     .replace(/translate\(\d*,/,'').replace('\)','') :
                  0,
        trueX = data.Role !== undefined ?
                  + element.getAttribute('transform')
                     .replace(/translate\(/,'').replace(/,\s*\d*\)/,'') :
                  0;
    console.log(trueX);
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
      exports = module.exports = LineChartRoleOnly;
    exports.LineChartRoleOnly = LineChartRoleOnly;
  } else if (typeof define === 'function' && define.amd)
    define('LineChartRoleOnly', [], function() {
      return LineChartRoleOnly;
    });
  else
    this.LineChartRoleOnly = LineChartRoleOnly;
}).call(this);
