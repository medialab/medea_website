(function(undefined) {
  'use strict';

  /**
   * MEDEA StackedBarsWGsByARsCaVsOthers Viz
   * ================
   *
   * Load the participations.json file and display the relevant "stackedBars" diagram
   */
  function StackedBarsWGsByARsCaVsOthers() {
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
    this.defaultCountry = 'France';
    this.userParams = {};
    this.chosenCountry = '';
  }

  StackedBarsWGsByARsCaVsOthers.prototype.load = function(path, callback) {
    var self = this;
    d3.json(path, function(participations) {
      self.data = participations;
      callback();
    });
  };

  StackedBarsWGsByARsCaVsOthers.prototype.drawViz = function(container, params) {
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

  StackedBarsWGsByARsCaVsOthers.prototype.updateData = function(container, country, params) {
    this.chosenCountry = country;
    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        margin = params.margin || this.defaultMargin,
        ratio = params.ratio || this.defaultRatio,
        vizName = params.vizName || 'viz',
        dataCountry = this.data[country];


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
        //Width of each AR group
        arGroupWidth = (effWidth - totalHoriSpace) / Object.keys(dataCountry.ars).length,
        //Width of each WG bars
        wgBarWidth = arGroupWidth / 3,
        //horizontal positions of each AR group
        xArGroupPositions = [],
        //relative horizontal positions of each WG inside their AR group
        xWGbarPosition = [0, wgBarWidth + 1, 2 * (wgBarWidth + 1)],
        //vertical positions of the bars
        yPositions = [],
        //Vertical scales for the bar heights
        scale = d3.scale.linear()
                    .range([0, barHeight])
                    .domain([0, dataCountry.max]);

      //Stores all the horizontal positions of the bars
      Object.keys(dataCountry.ars).forEach(function(category,i) {
        if (i === 0)
          xArGroupPositions.push(margin.left);
        else {
          xArGroupPositions.push(xArGroupPositions[i-1] +
                          arGroupWidth + Math.floor(totalHoriSpace/(Object.keys(dataCountry.ars).length)));
        }
      });

      d3.select(container + ' svg')
        .selectAll('.arGroups')
        .data(Object.keys(dataCountry.ars))
        .enter()
          .append('g')
          .attr('id',function(d) {return 'ar_' + d})
          .attr('class', 'arGroups')
          .on('mouseleave', function(d,i) {
            removeToolTipHTML('#' + params.vizName);
          });

      //Binds the data to the wgGroups
      var wgGroups = d3.selectAll('.arGroups')
          .attr('transform',function(d,i) {
            return 'translate(' + xArGroupPositions[i] + ',' + margin.top + ')';
          })
            .selectAll('.wgGroup')
            .data(function(d) {
              return Object.keys(dataCountry.ars[d]).sort().map(function(e, i, a) {
                var object = {
                      wg: e,
                      CA: dataCountry.ars[d][e].CA,
                      othersTotal: dataCountry.ars[d][e].othersTotal,
                      othersDetail: dataCountry.ars[d][e].othersDetail
                    };
                return object;
              });
            });

      var wgGroupsEnter = wgGroups.enter();
      wgGroupsEnter
        .append('g');

      wgGroups
        .attr('class', function(d, i) {
          return 'WG' + d.wg + ' wgGroup';
        })
        .attr('width', wgBarWidth)
        .attr('y', 0)
        .attr('height', function(d, i) {
          return scale(d.CA + d.othersTotal);
        })
        .attr('transform', function(d, i) {
          return 'translate(' + xWGbarPosition[i] + ',' + (barHeight - scale(d.CA + d.othersTotal)) + ')';
        });


      //Binds the data to the wgBars
      var wgBars = d3.selectAll('.wgGroup')
        .selectAll('.wgBar')
        .data(function(d) {
          //To put one level under
                // if (i === 0)
                //   yPositions = [0];
                // else {
                //   yPositions.push(yPositions[i-1] +
                //     scale(dataCountry[d][a[i-1]].percentage));
                // }

                // object.yPosition = yPositions[i];
          return [
            {
              wg: d.wg,
              total: d.othersTotal + d.CA,
              type: 'CA',
              count: d.CA,
              yPosition: scale(d.othersTotal)
            }, {
              wg: d.wg,
              type: 'Responsibility roles',
              total: d.othersTotal + d.CA,
              count: d.othersTotal,
              detail: d.othersDetail,
              yPosition: 0
            }];
        });
      var wgBarsEnter = wgBars.enter();
      wgBarsEnter
        .append('rect')
        .attr('class', function(d, i) {
          return 'wgBar ' + (d.type === 'CA' ? 'caRole' : 'respRole');
        })
        // .attr('transform', function(d) {
        //   return 'translate(0,' + (scale(d.total) - ) + ')';
        // })
        .on('mouseover', function(d,i) {
          drawToolTipHTML('#' + params.vizName, this, i, d);
        });


      wgBars
        .attr('width', wgBarWidth)
        .attr('height', function(d, i) {
          return scale(d.count);
        })
        .attr('x', 0)
        .attr('y', function(d) {
          return d.yPosition;
        });

      //Legend creation
      d3.select(container + ' svg')
        .append('g')
        .attr('id', 'barTitles')
        .selectAll('.barTitle')
        .data(Object.keys(dataCountry.ars).sort())
        .enter()
          .append('text')
          .attr('class','barTitle')
          .attr('y', margin.top + barHeight + 15)
          .attr('x', function(d, i) {return xArGroupPositions[i] + arGroupWidth/2; })
          .style('text-anchor', 'middle')
          .style('alignment-baseline', 'hanging')
          .style('dominant-baseline', 'hanging')
          .text(function(d, i) {return 'AR ' + d;})

      d3.select('#verticalAxis').remove();
      //Vertical axis legend
      d3.select(container + ' svg')
        .append('g')
        .attr('id', 'verticalAxis')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + (margin.left - 5) + ',' + margin.top + ')')
        .call(d3.svg.axis()
              .scale(
                d3.scale.linear().range([barHeight, 0]).domain([0, dataCountry.max])
                )
              .ticks(1)
              .tickValues([0, dataCountry.max])
              .tickFormat(function(d) {
                return d;
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
        .data(Object.keys(this.data).sort())
        .enter()
        .append('option')
        .attr('value', function(d) { return d; })
        .text(function(d) { return d; })

      countrySelector
        .style('width', countryTextSize + 25 + 'px')
        .selectAll('option')
        .data(Object.keys(this.data).sort())
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

      wgGroups.exit().remove();
      wgBars.exit().remove();
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

    var stackedTooltipLegend = data.type +': ' +
                            + data.count +
                            (data.count > 1 ? ' participations' :
                                          ' participation'),
        boundingRectBar = bar.getBBox(),
        paddingText = {top: 5, left: 5};

    var parentElementTransform =
                  bar.parentElement.getAttribute('transform') !== undefined ?
                  bar.parentElement.getAttribute('transform') :
                  '',

        grandParentElementTransform =
                  bar.parentElement.parentElement.getAttribute('transform') !== undefined ?
                  bar.parentElement.parentElement.getAttribute('transform') :
                  '',
        trueXParent = grandParentElementTransform !== '' ? (+parentElementTransform.replace(/translate\(/,'').replace(/,[\d.]*\)/,'')) :
                  0,
        trueXGParent = grandParentElementTransform !== '' ? (+grandParentElementTransform.replace(/translate\(/,'').replace(/,[\d.]*\)/,'')) :
                  0,
        trueYParent = grandParentElementTransform !== '' ? (+parentElementTransform.replace(/translate\([\d.]*,/,'').replace('\)','')) :
                  0,
        trueYGParent = grandParentElementTransform !== '' ? (+grandParentElementTransform.replace(/translate\([\d.]*,/,'').replace('\)','')) :
                  0;

    var trueY = trueYParent + trueYGParent,
        trueX = trueXParent + trueXGParent;

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
      exports = module.exports = StackedBarsWGsByARsCaVsOthers;
    exports.StackedBarsWGsByARsCaVsOthers = StackedBarsWGsByARsCaVsOthers;
  } else if (typeof define === 'function' && define.amd)
    define('StackedBarsWGsByARsCaVsOthers', [], function() {
      return StackedBarsWGsByARsCaVsOthers;
    });
  else
    this.StackedBarsWGsByARsCaVsOthers = StackedBarsWGsByARsCaVsOthers;

}).call(this);
