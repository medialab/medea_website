(function(undefined) {
  'use strict';

  /**
   * MEDEA StackedBars Viz
   * ================
   *
   * Load the participations.json file and display the relevant "stackedBars" diagram
   */
  function StackedBars() {
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
    this.defaultCountry = 'all';
    this.userParams = {};
  }

  StackedBars.prototype.load = function(path, callback) {
    var self = this;
    d3.json(path, function(participations) {
      for (var country in participations) {
        delete participations[country].total;
      }
      self.data = participations;
      callback();
    });
  };

  StackedBars.prototype.drawViz = function(container, params) {
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

  StackedBars.prototype.updateData = function(container, country, params) {
    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        margin = params.margin || this.defaultMargin,
        ratio = params.ratio || this.defaultRatio,
        vizName = params.vizName || 'viz',
        dataCountry = this.data[country],
        maxData = {};
    //Here we calculate the sum of the participations for bridges, non-bridge
    //and total
    for (var category in dataCountry) {
      maxData[category] = 0;

      for (var role in dataCountry[category]) {
        maxData[category] += dataCountry[category][role];
      }
    }

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
        barWidth = (effWidth - totalHoriSpace) / Object.keys(this.data[country]).length,
        //horizontal positions of the bars
        xPositions = [],
        //vertical positions of the bars
        yPositions = [],
        //Vertical scales for the bar heights
        scale = {
          bridge: d3.scale.linear()
                    .range([0, barHeight])
                    .domain([0, maxData.bridge]),
          nonBridge: d3.scale.linear()
                       .range([0, barHeight])
                       .domain([0, maxData.nonBridge]),
          total: d3.scale.linear()
                    .range([0, barHeight])
                    .domain([0, maxData.total])
        },
        //categoryData in Array
        categoryData = Object.keys(dataCountry).map(function(category) {
          var object = dataCountry[category];
          return object;
        });


      //Stores all the horizontal positions of the bars
      Object.keys(dataCountry).forEach(function(category,i) {
          if (i === 0)
            xPositions.push(margin.left);
          else {
            xPositions.push(xPositions[i-1] +
                            barWidth + Math.floor(totalHoriSpace/2));
          }
        })

      d3.select(container + ' svg')
        .selectAll('.categoryBars')
        .data(Object.keys(dataCountry))
        .enter()
          .append('g')
          .attr('id',function(d) {return 'cat_' + d})
          .attr('class', 'categoryBars')

      //Binds the data to the rects
      var rects = d3.selectAll('.categoryBars')
          .attr('transform',function(d,i) {
            return 'translate(' + xPositions[i] + ',' + margin.top + ')';
          })
            .selectAll('rect')
            .data(function(d) {
              return Object.keys(dataCountry[d]).sort().map(function(e, i, a) {
                var object = {
                      category: d,
                      role: e,
                      effective: dataCountry[d][e]
                    };

                if (i === 0)
                  yPositions = [0];
                else
                  yPositions.push(yPositions[i-1] +
                    scale[d](dataCountry[d][a[i-1]]));

                object.yPosition = yPositions[i];
                return object;
              });
            });

      var rectsEnter = rects.enter();
      rectsEnter
        .append('rect')
        .attr('class', function(d, i) {
          return d.role;
        });

      rects
        .attr('width', barWidth)
        .attr('y', function(d, i) {
          return d.yPosition
        })
        .attr('height', function(d, i) {
          return scale[d.category](d.effective);
        });

      //Percentage information on the right of the bars
      rects.enter()
        .append('text')
        .attr('class', function(d, i) {
          return 'roleLegend';
        });

      var roleLegend = d3.selectAll('.categoryBars')
        .selectAll('.roleLegend')
        .data(function(d) {
              return Object.keys(dataCountry[d]).sort().map(function(e, i, a) {
                var object = {
                      category: d,
                      role: e,
                      effective: dataCountry[d][e]
                    };

                if (i === 0)
                  yPositions = [0];
                else
                  yPositions.push(yPositions[i-1] +
                    scale[d](dataCountry[d][a[i-1]]));

                object.yPosition = yPositions[i];
                return object;
              });
            })
        .attr('y', function(d, i) {
          return d.yPosition + scale[d.category](d.effective)/2;
        })
        .attr('x', function(d, i) {
          return barWidth;
        })
        .attr('alignment-baseline', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(function(d, i) {
          return '- ' + d.role + ': ' +
            Math.round(d.effective/maxData[d.category] * 100) + '%';
        });


      // //Title creation
      // var title =
      //   d3.select(container + ' svg')
      //   .selectAll('#vizTitle')
      //   .data([country]);

      // title.enter()
      //     .append('text')
      //     .attr('id', 'vizTitle')
      //     .attr('y', margin.top/2)
      //     .attr('x', margin.left + effWidth/2)
      //     .style('text-anchor', 'middle')

      // d3.select('#vizTitle')
      //   .text('Role repartition by author\'s type - ' +
      //         country + (country === 'all' ? ' countries' : ''))

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
          .attr('x', function(d, i) {return xPositions[i] + barWidth/2; })
          .style('text-anchor', 'middle')
          .style('alignment-baseline', 'hanging')
          .style('dominant-baseline', 'hanging')
          .text(function(d, i) {return d === 'nonBridge' ? 'non-bridge' : d;})

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
      rects.exit().remove();
      roleLegend.exit().remove();
  };

  // Exporting
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = StackedBars;
    exports.StackedBars = StackedBars;
  } else if (typeof define === 'function' && define.amd)
    define('StackedBars', [], function() {
      return StackedBars;
    });
  else
    this.StackedBars = StackedBars;

}).call(this);
