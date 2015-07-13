;(function(undefined) {
  'use strict';

  var cleantext = function(text) {
    return text.replace(/ /g, "&nbsp;");
  };

  /**
   * IPCC People Lines Viz
   * ======================
   *
   * A shiny 'troupeau de lignes' displaying authors participations across
   * assesment reports.
   */

  /**
   * Abstract
   */
  function Viz() {

    // Properties
    this.countries = null;
    this.listCountries = null;
    this.data = {};

    this.defaultCountry = "France";
    this.defaultSort = "participation";
    this.defaultWidth = 700;
    this.defaultMargin = {top: 20, bottom: 20, left: 20, right: 20};
    this.defaultLineMargin = {top: 2, bottom: 2, left: 0, right: 0};
    this.defaultNameColumnWidth = 200;
    this.defaultLineHeight = 20;
    this.lineWidth = 10;
    this.lineMargin = 1;
  }


  /**
   * Prototype
   */
  Viz.prototype.load_countries = function(path, callback) {
    d3.json(path, (function(data) {
      this.countries = data;
      this.listCountries = Object.keys(data).sort();
      if (typeof callback === 'function')
        callback();
    }).bind(this));
  };

  Viz.prototype.load_country = function(country, rootpath, callback) {
    if (!this.countries)
      throw Error('IPCCPeopleLines.load_country: countries data was not loaded.');
    if (!this.countries[country])
      throw Error('IPCCPeopleLines.load_country: country missing from countries data.');
    // Avoid reloading pre-cached country data
    if (this.data[this.countries[country]]) {
      if (typeof callback === 'function')
        return callback();
      return;
    }
    var path = (rootpath ? rootpath : "data") + "/ipcc-people-participations-" + this.countries[country] + ".json";
    d3.json(path, (function(data) {
      this.data[this.countries[country]] = data;
      if (typeof callback === 'function')
        callback();
    }).bind(this));
  };

  Viz.prototype.draw_country = function(container, country, sort, params) {
    Viz.tooltip = d3.select('body')
      .append("div")
      .attr("class", "linestooltip");

    if (!this.countries)
      throw Error('IPCCPeopleLines.draw: countries data was not loaded.');
    if (!this.countries[country])
      throw Error('IPCCPeopleLines.draw: country missing from countries data.');
    if (!this.data[this.countries[country]])
      throw Error('IPCCPeopleLines.draw: country data was not loaded.');

    var data = this.data[this.countries[country]],
        sorting = sort || this.defaultSort,
        width = params.width || this.defaultWidth,
        margin = params.margin || this.defaultMargin,
        lineWidth = this.lineWidth,
        lineMargin = this.lineMargin,
        maxParticipations = d3.max(data.map(function(d) {
          return [d.ar1.total, d.ar2.total, d.ar3.total, d.ar4.total, d.ar5.total];
        }).reduce(function(a, b) {
          return a.concat(b);
        }, []));

    //new variables to easier configutation
    //Name column width
    var nameColumnWidth = params.nameColumnWidth || this.defaultNameColumnWidth,
        //Width the viz actually takes
        effectiveWidth = width - margin.left - margin.right,
        //Width the AR heatmap takes (without the names)
        totalArWidth = effectiveWidth - nameColumnWidth,
        //AR unit width
        arWidth = totalArWidth / 5,
        //Horizontal position where each column starts
        xStartPositions = {
          //This one is like this because right alignment
          nameColumn: margin.left + nameColumnWidth - 10 ,
          arColumn: margin.left + nameColumnWidth
        },
        lineHeight = params.lineHeight || this.defaultLineHeight,
        lineMargin = params.lineMargin || this.defaultLineMargin;

    var y = d3.scale.linear()
      .domain([0, maxParticipations])
      .range(['rgba(50, 106, 122, 0.3)', 'rgba(50, 106, 122, 1)']);

    data.sort(function(a,b) {
      if (sorting === "chrono") {
        if (a.first_ar != b.first_ar)
          return a.first_ar - b.first_ar;
        if (a.total_part != b.total_part)
          return b.total_part - a.total_part;
        return b.total_ars - a.total_ars;
      } else if (sorting === "participations") {
        if (a.total_part != b.total_part)
          return b.total_part - a.total_part;
        if (a.total_ars != b.total_ars)
          return b.total_ars - a.total_ars;
        return a.first_ar - b.first_ar;
      } else if (sorting === "reports") {
        if (a.total_ars != b.total_ars)
          return b.total_ars - a.total_ars;
        if (a.total_part != b.total_part)
          return b.total_part - a.total_part;
        return a.first_ar - b.first_ar;
      } else if (sorting === "alpha") {
        return a.name.localeCompare(b.name);
      }
    });
    var svgHeight = margin.top + margin.bottom;
    data.forEach(function(d, i) {
      svgHeight += lineHeight;
      d.y1 = margin.top + lineHeight * i;

      [1,2,3,4,5].forEach(function(ar) {
        var metas = (d.institution && d.institution !== "N/A" ? d.institution :
              (d.department && d.department !== "N/A" ? d.department : "")),
            contribs = "";
        if (metas) metas = "<p>" + cleantext(metas) + "</p>";
        d['ar' + ar].participations.forEach(function(p) {
          contribs += cleantext("<li>" + p.role + " - WG " + p.wg +
            " - CH" + p.chapter) +
            " (" + p.chapter_title + ")</li>";
        });
        d["tooltip" + ar] =
          "<h3><b>" + cleantext(d.name) + "</b> (AR " + ar + ")</h3>" + metas +
          "<ul>" + contribs + "</ul>";
      });
    });

    var chart;
    if (d3.select(container).select('svg').empty()) {
      chart = d3.select(container)
        .append('svg')
          .attr('id','linesSVG')
          .attr('width', width)
          .attr('height', svgHeight);
    }
    else {
      chart = d3.select(container).select('svg')
        .attr('id','linesSVG')
        .attr('width', width)
        .attr('height', svgHeight);
      chart.selectAll('g').remove();
    }

    var group = chart.selectAll('.lines')
      .data(data)
      .enter().append('g');

    var text = group.append('text')
      .attr('x', xStartPositions.nameColumn)
      .attr('y', function(d) {
        return d.y1 + lineMargin.top;
       })
      .attr('alignment-baseline', 'middle')
      .style('text-anchor', 'end')
      .style('font-size', '11px')
      .text(function(d) {
        return d.name;
      });

    [1, 2, 3, 4, 5].forEach(function(ar, ari) {
      var subline = group
        .append('line')
          .attr('x1', xStartPositions.arColumn + arWidth * (ari))
          .attr('x2', xStartPositions.arColumn + arWidth * (ari + 1))
          .attr('y1', function(d, i) {
            return d.y1 + lineMargin.top;
          })
          .attr('y2', function(d, i) {
            return d.y1 + lineMargin.top;
          })
          .attr('stroke-width', function(d) {
            return lineHeight - (lineMargin.top + lineMargin.bottom);
          })
          .attr('stroke', function(d) {
            return d['ar' + ar].total ? y(d['ar' + ar].total) : '#ccc';
          })
          .attr('shape-rendering', 'crispEdges')
          .filter(function(d) {
            return d['ar' + ar].total;
          })
          .on('mouseover', function(d, i) {
            drawToolTipHTML('#linesSVG', this, i, d["tooltip" + ar]);
          })
          .on('mouseout', function(d) {
            removeToolTipHTML('#linesSVG', this);
          });
    }, this);
  };

  function removeToolTipHTML(container, bar) {
    d3.selectAll('.ipccPeopleLinesTooltipContainer').remove();

    var elemHoverBar = document.querySelectorAll('.hoverBar');
    for (var i = 0; i < elemHoverBar.length; i++) {
      var e = elemHoverBar[i];
      e.setAttribute('class', e.getAttribute('class').replace(/ hoverBar/, ''));
    }

  }

  function drawToolTipHTML(component, bar, id, data, complementary) {
    var trueSvgPositions = document.getElementById(component.replace('#',''))
                  .getBoundingClientRect();

    //Remove the possibly existing tooltip
    d3.select('#ipccPeopleLinesTooltipContainer_' + component.replace('#','')).remove();

    //Enables the styling with the hover
    bar.setAttribute("class", bar.getAttribute("class")+ ' hoverBar');

    var powerLawTooltipLegend = data,
        boundingRectBar = bar.getBBox(),
        paddingText = {top: 5, left: 5};

    var trueY = data.chapterName !== undefined ?
                  + bar.getAttribute('transform')
                     .replace(/translate\(\d*,/,'').replace('\)','') :
                  0;
    d3.select('body')
      .append('div')
      .attr('id', 'ipccPeopleLinesTooltipContainer_' + component.replace('#',''))
      .attr('class', 'ipccPeopleLinesTooltipContainer')
      .append('div')
      .attr('class', 'ipccPeopleLinesTooltipText tooltipText')
      .attr('id', 'ipccPeopleLinesTooltipText_' + component.replace('#',''))
        .style('position', 'absolute')
        .style('padding', paddingText.top + 'px ' + paddingText.left + 'px')

    d3.select('#ipccPeopleLinesTooltipText_' + component.replace('#',''))
      .html(powerLawTooltipLegend);

    var svgBbox = d3.select(component)[0][0].getBBox(),
        xMax = svgBbox.x + svgBbox.width,
        xMin = svgBbox.x;

    //Here we create an arrow of the given side
    var arrowSide = 8;
    d3.select('#ipccPeopleLinesTooltipContainer_' + component.replace('#',''))
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
    var tooltipWidth = document.getElementById('ipccPeopleLinesTooltipText_' + component.replace('#','')).clientWidth -
                       2 * paddingText.left,
        tooltipHeight = document.getElementById('ipccPeopleLinesTooltipText_' + component.replace('#','')).clientHeight -
                       2 * paddingText.top,
        xFinalText = boundingRectBar.x + boundingRectBar.width/2 +
                     tooltipWidth/2,
        xStartText = boundingRectBar.x + boundingRectBar.width/2 -
                     tooltipWidth/2;

    if (xFinalText >= xMax )
      d3.select('#ipccPeopleLinesTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + xStartText - (xFinalText - xMax) + 'px')
    else if (xStartText <= xMin)
      d3.select('#ipccPeopleLinesTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + xMin + 'px')
    else
      d3.select('#ipccPeopleLinesTooltipText_' + component.replace('#',''))
        .style('left', trueSvgPositions.left + Math.round(boundingRectBar.x +
                        boundingRectBar.width/2 - tooltipWidth/2) + 'px');

    d3.select('#ipccPeopleLinesTooltipText_' + component.replace('#',''))
      .style('top', trueSvgPositions.top + boundingRectBar.y + trueY -
                    tooltipHeight - 2*arrowSide - 2 + 'px');
  }

  // Exporting
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = Viz;
    exports.IPCCPeopleLines = Viz;
  } else if (typeof define === 'function' && define.amd)
    define('IPCCPeopleLines', [], function() {
      return Viz;
    });
  else
    this.IPCCPeopleLines = Viz;
}).call(this);

