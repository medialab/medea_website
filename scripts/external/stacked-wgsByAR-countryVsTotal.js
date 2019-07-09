(function(undefined) {
  'use strict';

  /**
   * MEDEA StackedBarsWGsByARsCountryVsTotal Viz
   * ================
   *
   * Load the participations.json file and display the relevant "stackedBars" diagram
   */
  function StackedBarsWGsByARsCountryVsTotal() {
    //Properties
    this.data = null;
    this.defaultHeight = 400;
    this.defaultWidth = 200;
    this.defaultMargin = {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40
    };
    this.defaultRatio = {
      verti: 0,
      hori: 0.4
    };
    this.orderStack = ['WG1', 'WG1+2', 'WG2', 'WG2+3', 'WG3', 'WG1+3', 'WG1+2+3'];
    this.defaultCountry = 'France';
    this.userParams = {};
    this.chosenCountry = '';
  }

  StackedBarsWGsByARsCountryVsTotal.prototype.load = function(path, callback) {
    var self = this;
    d3.json(path, function(participations) {
      self.data = participations;
      callback();
    });
  };

  StackedBarsWGsByARsCountryVsTotal.prototype.drawViz = function(container, params) {
    if (params.country === undefined) {
      if (this.chosenCountry !== '')
        params.country = this.chosenCountry;
      else
        params.country = this.defaultCountry;
    }
    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        country = params.country || this.defaultCountry,
        vizName = params.vizName || 'viz',
        margin = params.margin || this.defaultMargin,
        self = this;
    this.userParams = params;

    d3.select(container + ' svg').remove();
    //Creates the chart component inside
    var chart = d3.select(container)
      .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', vizName);

    this.updateData(container, country, params);
  }

  StackedBarsWGsByARsCountryVsTotal.prototype.updateData = function(container, country, params) {
    this.chosenCountry = country;
    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        margin = params.margin || this.defaultMargin,
        ratio = params.ratio || this.defaultRatio,
        vizName = params.vizName || 'viz',
        orderStack = this.orderStack,
        dataCountry = this.data.countries[country],
        dataTotal = this.data.total.total;


        //Height the viz can actually take (allows margins)
    var effHeight = height - (margin.top + margin.bottom),
        //Width the viz can actually take (allows margins)
        effWidth = width - (margin.left + margin.right),
        //total horizontal space
        totalHoriSpace = effWidth * ratio.hori,
        //total vertical space
        totalVertiSpace = effHeight * ratio.verti,
        //Height of the bars
        barHeight = effHeight - totalVertiSpace,
        //Width of the bard
        barWidth = (effWidth - totalHoriSpace) / Object.keys(dataCountry).length,
        //horizontal positions of the country bars
        xPositionsCountry = [],
        //horizontal positions of the total bars
        xPositionsTotal = [],
        //vertical positions of the bars
        yPositions = [],
        yPositionsTotal = [],
        //Vertical scales for the bar heights
        scale = d3.scale.linear()
                    .range([0, barHeight])
                    .domain([0, 100]),
        //categoryData in Array
        categoryData = Object.keys(dataCountry).map(function(category) {
          var object = dataCountry[category];
          return object;
        });

      //Stores all the horizontal positions of the bars
      Object.keys(dataCountry).forEach(function(category,i) {
        if (i === 0) {
          xPositionsCountry.push(margin.left);
          xPositionsTotal.push(margin.left + barWidth/2 + 3);
        }
        else {
          xPositionsCountry.push(xPositionsCountry[i-1] +
                          barWidth + Math.floor(totalHoriSpace/(Object.keys(dataCountry).length)));
          xPositionsTotal.push(xPositionsTotal[i-1] +
                          barWidth + Math.floor(totalHoriSpace/(Object.keys(dataCountry).length)));
        }
      });

      d3.select(container + ' svg')
        .selectAll('.categoryBarsCountry')
        .data(Object.keys(dataCountry))
        .enter()
          .append('g')
          .attr('id',function(d) {return 'cat_' + d})
          .attr('class', 'categoryBarsCountry')
          .on('mouseleave', function(d,i) {
            removeToolTipHTML('#' + params.vizName);
          });
      d3.select(container + ' svg')
        .selectAll('.categoryBarsTotal')
        .data(Object.keys(dataTotal))
        .enter()
          .append('g')
          .attr('id',function(d) {return 'cat_' + d})
          .attr('class', 'categoryBarsTotal')
          .on('mouseleave', function(d,i) {
            removeToolTipHTML('#' + params.vizName);
          });

      //Binds the data to the countryRects
      var countryRects = d3.selectAll('.categoryBarsCountry')
          .attr('transform',function(d,i) {
            return 'translate(' + xPositionsCountry[i] + ',' + margin.top + ')';
          })
            .selectAll('rect')
            .data(function(d) {
              return Object.keys(dataCountry[d]).sort(function(a, b) {
                return -(orderStack.indexOf(a) - orderStack.indexOf(b));
              }).map(function(e, i, a) {
                var object = {
                      country: country,
                      wg: e,
                      participation: dataCountry[d][e].participation,
                      percentage: dataCountry[d][e].percentage
                    };

                if (i === 0)
                  yPositions = [0];
                else {
                  yPositions.push(yPositions[i-1] +
                    scale(dataCountry[d][a[i-1]].percentage));
                }

                object.yPosition = yPositions[i];
                return object;
              });
            });


      //Binds the data to the totalRects
      var totalRects = d3.selectAll('.categoryBarsTotal')
          .attr('transform',function(d,i) {
            return 'translate(' + xPositionsTotal[i] + ',' + margin.top + ')';
          })
            .selectAll('rect')
            .data(function(d) {
              return Object.keys(dataTotal[d]).sort(function(a, b) {
                return -(orderStack.indexOf(a) - orderStack.indexOf(b));
              }).map(function(e, i, a) {
                var object = {
                      country: 'Total',
                      wg: e,
                      participation: dataTotal[d][e].participation,
                      percentage: dataTotal[d][e].percentage
                    };

                if (i === 0)
                  yPositionsTotal = [0];
                else {
                  yPositionsTotal.push(yPositionsTotal[i-1] +
                    scale(dataTotal[d][a[i-1]].percentage));
                }

                object.yPosition = yPositionsTotal[i];
                return object;
              });
            });

      var countryRectsEnter = countryRects.enter();
      countryRectsEnter
        .append('rect')
        .on('mouseover', function(d,i) {
          drawToolTipHTML('#' + params.vizName, this, i, d);
        });

      countryRects
        .attr('class', function(d, i) {
          return d.wg.replace(/\+/g, '-');
        })
        .attr('width', barWidth/2)
        .attr('y', function(d, i) {
          return d.yPosition
        })
        .attr('height', function(d, i) {
          return scale(d.percentage);
        });

      //Percentage information on the right of the bars
      countryRects.enter()
        .append('text')
        .attr('class', function(d, i) {
          return 'wgLegend';
        });

      var totalRectsEnter = totalRects.enter();
      totalRectsEnter
        .append('rect')
        .attr('class', function(d, i) {
          return d.wg.replace(/\+/g, '-');
        })
        .on('mouseover', function(d,i) {
          drawToolTipHTML('#' + params.vizName, this, i, d);
        });

      totalRects
        .attr('width', barWidth/2)
        .attr('y', function(d, i) {
          return d.yPosition
        })
        .attr('height', function(d, i) {
          return scale(d.percentage);
        });

      //Percentage information on the right of the bars
      totalRects.enter()
        .append('text')
        .attr('class', function(d, i) {
          return 'wgLegend';
        });


      //Legend creation
      d3.select(container + ' svg')
        .append('g')
        .attr('id', 'barTitles')
        .selectAll('.barTitle')
        .data(Object.keys(dataCountry).sort())
        .enter()
          .append('text')
          .attr('class','barTitle')
          .attr('y', margin.top + barHeight + 15)
          .attr('x', function(d, i) {return xPositionsCountry[i] + barWidth/2; })
          .style('text-anchor', 'middle')
          .style('alignment-baseline', 'hanging')
          .style('dominant-baseline', 'hanging')
          .text(function(d, i) {return 'AR ' + d;})

      //Vertical axis legend
      d3.select(container + ' svg')
        .append('g')
        .attr('id', 'verticalAxis')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + (margin.left - 5) + ',' + margin.top + ')')
        .call(d3.svg.axis()
              .scale(
                d3.scale.linear().range([barHeight, 0]).domain([0, 100])
                )
              .ticks(1)
              .tickValues([0, 100])
              .tickFormat(function(d) {
                return d + '%';
              })
              .orient('left'));
      //Changes the graph title
      var vizTitleContainer = d3.select('#vizTitleContainer'),
          countrySelector = d3.select('select#titleCountry');

      //small trick to have the select box always at the good size
      vizTitleContainer.append('div')
        .attr('id','measureTextDiv')
        .style('position', 'absolute')
        .style('font', '12px "Raleway"')
        .text(country);
      var countryTextSize = d3.select('#measureTextDiv')[0][0].getBoundingClientRect().width;
      d3.select('#measureTextDiv').remove();

      //Build the string containing the country options
      countrySelector
        .selectAll('option')
        .data(Object.keys(this.data.countries).sort())
        .enter()
        .append('option')
        .attr('value', function(d) { return d; })
        .text(function(d) { return d; })

      countrySelector
        .style('width', countryTextSize + 25 + 'px')
        .selectAll('option')
        .data(Object.keys(this.data.countries).sort())
        .attr('selected', function(d) {
          return d === country ? '' : null;
        });

      var self = this;
      countrySelector
      .on('change', function() {
        self.updateData(container, this.options[this.selectedIndex].text, params)

        //small trick to have the select box always at the good size
        vizTitleContainer.append('div')
          .attr('id','measureTextDiv')
          .style('position', 'absolute')
          .style('font', '12px "Raleway"')
          .text(this.options[this.selectedIndex].text);

        var countryTextSize = d3.select('#measureTextDiv')[0][0].getBoundingClientRect().width;
        d3.select('#measureTextDiv').remove();
        countrySelector.style(
          'width', countryTextSize + 25 + 'px');
      });
      countryRects.exit().remove();
      totalRects.exit().remove();
  };

    function removeToolTipHTML(container) {
    d3.selectAll('.stackedTooltipContainer').remove();

    var elemHoverBar = document.querySelectorAll('.hoverBar');
    for (var i = 0; i < elemHoverBar.length; i++) {
      var e = elemHoverBar[i];
      e.setAttribute('class', e.getAttribute('class').replace(/ hoverBar/, ''));
    }

  }

  function drawToolTipHTML(component, bar, id, data, complementary) {
    var wg = data.wg;
    //Remove the possibly existing tooltip
    d3.selectAll('.stackedTooltipContainer').remove();

    var trueSvgPositions = document.querySelector(component)
                  .getBoundingClientRect();
    //Enables the styling with the hover
    bar.setAttribute("class", bar.getAttribute("class")+ ' hoverBar');

    var stackedTooltipLegend = data.country + ' - ' + data.wg + ': ' +
                            + (+data.percentage).toFixed(2) + '% ('
                            + data.participation +
                            (data.participation > 1 ? ' participations)' :
                                          ' participation)'),
        boundingRectBar = bar.getBBox(),
        paddingText = {top: 5, left: 5};

    var trueY = bar.parentElement.getAttribute('transform') !== undefined ?
                  + bar.parentElement.getAttribute('transform')
                     .replace(/translate\([\d.]*,/,'').replace('\)','') :
                  0,
        trueX = bar.parentElement.getAttribute('transform') !== undefined ?
                  + bar.parentElement.getAttribute('transform')
                     .replace(/translate\(/,'').replace(/,[\d.]*\)/,'') :
                  0;

    d3.select('body')
      .append('div')
      .attr('id', 'stackedTooltipContainer_' + component.replace('#',''))
      .attr('class', 'stackedTooltipContainer')
      .append('div')
      .attr('class', 'stackedTooltipText tooltipText')
      .attr('id', 'stackedTooltipText_' + component.replace('#',''))
        .style('position', 'absolute')
        .style('padding', paddingText.top + 'px ' + paddingText.left + 'px')

    d3.select('#stackedTooltipText_' + component.replace('#',''))
      .text(stackedTooltipLegend);

    var svgBbox = d3.select(component)[0][0].getBBox(),
        xMax = svgBbox.x + svgBbox.width,
        xMin = svgBbox.x;

    //Here we create an arrow of the given side
    var arrowSide = 8;
    d3.select('#stackedTooltipContainer_' + component.replace('#',''))
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
                     arrowSide + trueSvgPositions.left + trueX + 'px')
      .style('top', boundingRectBar.y + trueSvgPositions.top + trueY - arrowSide + 'px')


    //Text in the tooltip horizontal alignement if out of the svg on the right
    var tooltipWidth = document.getElementById('stackedTooltipText_' + component.replace('#','')).clientWidth -
                       2 * paddingText.left,
        tooltipHeight = document.getElementById('stackedTooltipText_' + component.replace('#','')).clientHeight -
                       2 * paddingText.top,
        xFinalText = boundingRectBar.x + trueX + boundingRectBar.width/2 +
                     tooltipWidth/2,
        xStartText = boundingRectBar.x + trueX+boundingRectBar.width/2 -
                     tooltipWidth/2;

    if (xFinalText >= xMax )
      d3.select('#stackedTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + xStartText - (xFinalText - xMax) + 'px')
    else if (xStartText <= xMin)
      d3.select('#stackedTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + xMin + 'px')
    else
      d3.select('#stackedTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + Math.round(boundingRectBar.x +
                       trueX + boundingRectBar.width/2 - tooltipWidth/2) + 'px');

    d3.select('#stackedTooltipText_' + component.replace('#',''))
      .style('top', trueSvgPositions.top + boundingRectBar.y + trueY -
                    tooltipHeight - 2*arrowSide - 2 + 'px');
  }

  // Exporting
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = StackedBarsWGsByARsCountryVsTotal;
    exports.StackedBarsWGsByARsCountryVsTotal = StackedBarsWGsByARsCountryVsTotal;
  } else if (typeof define === 'function' && define.amd)
    define('StackedBarsWGsByARsCountryVsTotal', [], function() {
      return StackedBarsWGsByARsCountryVsTotal;
    });
  else
    this.StackedBarsWGsByARsCountryVsTotal = StackedBarsWGsByARsCountryVsTotal;

}).call(this);
