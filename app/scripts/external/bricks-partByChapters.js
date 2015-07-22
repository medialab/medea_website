(function(undefined) {
  'use strict';

  /**
   * MEDEA Bricks Viz
   * ================
   *
   * Load the participations.json file and display the relevant "brick" diagram
   */
  function Bricks() {
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
    this.defaultCountry = 'France';
    this.defaultRatio = {
      verti: 0.2,
      hori: 0.2
    };
    this.userParams = {};
    this.chosenCountry = '';
  }

  Bricks.prototype.load = function(path, callback) {
    var self = this;
    d3.json(path, function(participations) {
      self.data = participations;
      callback();
    });
  };

  Bricks.prototype.drawViz = function(container, params) {

    if (params.country === undefined) {
      if (this.chosenCountry !== '')
        params.country = this.chosenCountry;
      else
        params.country = this.defaultCountry;
    }

    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        country = params.country,
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

    this.updateData(container, country, params)
  }

  /**
   * Gets the biggest number of chapters in the different AR
   * Thsi is useful to calculate a same height for all the ARs.
   */
  function getNbChaptMax(data){
    var nbChapMax = 0;

    for(var ar in data[Object.keys(data)[0]]) {
      var dataAR = data[Object.keys(data)[0]][ar].wg;

      for (var wg in dataAR) {
        var nbChap = Object.keys(dataAR[wg].chaptersCountryPart).length;
        if (nbChap > nbChapMax)
          nbChapMax = nbChap;
      }
    }

    return nbChapMax;
  }

  Bricks.prototype.updateData = function(container, country) {
    this.chosenCountry = country;
    var params = this.userParams;

    var height = params.height || this.defaultHeight,
        width = params.width || this.defaultWidth,
        margin = params.margin || this.defaultMargin,
        ratioSpaceVsBar = params.ratio || this.defaultRatio,
        vizName = params.vizName || 'viz',
        dataCountry = this.data[country];

        //Height the viz can actually take (allows margins)
    var effHeight = height - (margin.top + margin.bottom),
        //Width the viz can actually take (allows margins)
        effWidth = width - (margin.left + margin.right),
        //Maximum number of chapters an AR can have (in order to determine a
        //a common bar Height)
        nbChapMax = getNbChaptMax(this.data),
        //nbSpaces is the number of spaces we want between the top bar
        //and the others i.e. there is a space `nbSpaces` times bigger than a
        //vertical space between 2 bars
        nbSpaces = 3,
        barHeight = Math.floor(effHeight /
                    ((nbChapMax) * (1 + ratioSpaceVsBar.verti) +
                      1 + nbSpaces * ratioSpaceVsBar.verti)),
        //Total width attributed to an AR
        oneARwidth = (effWidth / 5),
        //Total horizontal margin attributed to an ar (i.e. space to put between
        //every WG bars)
        totalInnerMargin = oneARwidth * ratioSpaceVsBar.hori,
        //Numbers of bars in each AR group
        nbOfBars = 3,
        //Unitary space between 2 bars
        spaceHoriUnit = totalInnerMargin / (nbOfBars + 1),
        //Unitary space between 2 bars
        spaceVertiUnit = 1;

    var trueSvgPositions = document.getElementById(container.replace('#','')).getBoundingClientRect();

    var chart = d3.select(container + ' svg')

    //For every AR
    for (var i = 0; i < Object.keys(dataCountry).length; i++) {
      var ar = +Object.keys(dataCountry)[i],
          //contains all the data for a given AR
          dataAR = dataCountry[ar],
          //all the participations for the given AR
          partTotalAR = dataAR.totalPartAR,
          //all the country's participations in the given AR
          partCountryAR = dataAR.totalCountryAR,
          //Scale for AR total values
          scaleARX = d3.scale.linear()
                    .range([0, oneARwidth - 2 * spaceHoriUnit])
                    .domain([0, modifLog(partTotalAR)]),
          //Scale to build the WG total bars
          //If the country's participation is null, we consider the maximum as
          //99 so we can divide it in 3 equals part
          scaleWG = d3.scale.linear()
                    .range([0, oneARwidth - (2 + 2) * spaceHoriUnit])
                    .domain([0, 99]),//partCountryAR === 0 ? 99 : partCountryAR]),
          //Horizontal starting position for the ar block (without the left
          //padding)
          xStartPosition = margin.left + (+ar - 1) * oneARwidth,
          //Vertical starting position for the chapter bars (not the totalAR
          //one)
          yStartPosition = effHeight + margin.top - margin.bottom +
                          - barHeight -
                          9 * spaceVertiUnit;

      var arGroup = chart
                      .append('g')
                      .attr('class', 'arGroup')
                      .attr('id', 'ar' + ar);

      //Adds the AR top bars
      createARbar(arGroup, ar, {
                                 effHeight: effHeight,
                                 barHeight: barHeight,
                                 margin: margin,
                                 ratio: ratioSpaceVsBar,
                                 country: country,
                                 oneARwidth: oneARwidth,
                                 spaceHoriUnit: spaceHoriUnit,
                                 spaceVertiUnit: spaceVertiUnit,
                                 scaleX: scaleARX,
                                 partTotalAR: partTotalAR,
                                 xStartPosition: xStartPosition,
                                 totalCountryAR: partCountryAR,
                                 container: '#' + params.vizName,
                                 trueSvgPositions: trueSvgPositions
                               });

      drawWGs(container + ' svg', arGroup, ar, {
        dataAR: dataAR,
        barHeight: barHeight,
        margin: margin,
        ratio: ratioSpaceVsBar,
        spaceHoriUnit: spaceHoriUnit,
        spaceVertiUnit: spaceVertiUnit,
        xStartPosition: xStartPosition,
        yStartPosition: yStartPosition,
        scaleX: scaleWG,
        country: country,
        container: '#' + params.vizName,
        trueSvgPositions: trueSvgPositions
      });
    }

    var chartBbox = chart[0][0].getBBox();

    //Changes the graph title
    var vizTopContainer = d3.select('#vizTopContainer'),
        vizTitleContainer = d3.select('#vizTitleContainer'),
        countrySelector = d3.select('select#titleCountry');
    vizTopContainer
      .style('width', chartBbox.width + 'px');
    vizTitleContainer
      // .style('left', chartBbox.x + spaceHoriUnit /2  + 'px')
      .style('top', margin.top/2.5 + 'px');

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
      // .style('left', margin.left + 2 * spaceHoriUnit + chartBbox.width/2 + 80 + 'px')
      // .style('top', margin.top/2 - 1+ 'px')
      .selectAll('option')
      .data(Object.keys(this.data).sort())
      .attr('selected', function(d) {
        return d === country ? '' : null;
      });

    //Change listener for the select box
    var self = this;
    countrySelector
      .on('change', function() {
        self.updateData(container, this.options[this.selectedIndex].text)

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
  }

  //Triggers the drawing of the different WG of an AR
  function drawWGs(svg, arGroup, ar, params) {
    var dataAR = params.dataAR,
        wgs = dataAR.wg;

    var nbEmptyWG = 0;

    //Calculate the number of empty WG in the AR
    for (var wg in wgs) {
      //Count a WG as empty only if there is at least one participation in the
      //AR
      if (!(dataAR.totalCountryAR === 0) && dataAR.wg[wg].totalCountryWG === 0)
        nbEmptyWG++;
    }

    // Phantom WG bars parameters
    var phantomWidth = 2,
        unitLengthToDecrease = (phantomWidth * nbEmptyWG) /
                               Math.abs((Object.keys(wgs).length - nbEmptyWG));

    //x positions for the WG bars
    var xPositions = [params.xStartPosition + params.spaceHoriUnit],
        widthTotalBars = {};
    for (var wg in wgs) {
      var initialWidth = params.scaleX(33);//dataAR.totalCountryAR === 0 ?
                                 //33 : wgs[wg].totalCountryWG);
      //The width is adapted is the country has not participated to an AR
      widthTotalBars[wg] = initialWidth === 0 ? phantomWidth : initialWidth;// - unitLengthToDecrease;

      var nextXPosition = xPositions[xPositions.length-1] +
                          widthTotalBars[wg] +
                          params.spaceHoriUnit;
      xPositions.push(nextXPosition);
    }


    //Then we draw all the WG bars
    for (var i = 0; i < Object.keys(dataAR.wg).length; i++) {
      var wg = Object.keys(dataAR.wg)[i];

      //We sort the chapters by ascending order
      var chapters =
        Object.keys(dataAR.wg[wg].chaptersCountryPart).sort(function(a,b) {
          var aCasted = +a,
              bCasted = +b;
          if (!isNaN(aCasted) && !isNaN(bCasted))
            return aCasted - bCasted;
          else if (!isNaN(aCasted) && isNaN(bCasted))
            return -1;
          else if (isNaN(aCasted) && !isNaN(bCasted))
            return 1;
          else {
            return a>b;
          }
      });

      //Aggregated data (chapter with effectives)
      var chaptersWithWG = chapters.map(function(d) {
        var objectToReturn = {
          chapterName: d,
          chapterTitle: dataAR.wg[wg].chaptersTitle[d],
          wgNumber: wg,
          arNumber: ar,
          country: params.country
        };
        objectToReturn['wg'] = {
          //participation of the country on the chapter in this WG and this AR
          chapterEffective: wgs[wg]['chaptersCountryPart'][d],
          chapterTotal: wgs[wg]['chaptersTotalPart'][d],
          phantom: wgs[wg]['totalCountryWG'] === 0
        };
        return objectToReturn;
      });


      //Draws the chapter bars for a given AR
      drawChaptersWG(svg, arGroup, ar, wg, chaptersWithWG, {
        data: dataAR,
        margin: params.margin,
        spaceHoriUnit: params.spaceHoriUnit,
        spaceVertiUnit: params.spaceVertiUnit,
        barHeight: params.barHeight,
        ratio: params.ratio,
        xStartPosition: params.xStartPosition,
        yStartPosition: params.yStartPosition,
        xPosition: xPositions[i],
        container: params.container,
        widthTotalBar: widthTotalBars[wg],
        trueSvgPositions: params.trueSvgPositions
      });
    }
  }

  //Creates the participation bars in a chapter for a given AR and a given WG
  function drawChaptersWG(svg, arGroup, ar, wg, chaptersWithWG, params) {
    //Data
    var dataAR = params.data,
        wgs = dataAR.wg,
        nbEmptyWG = params.nbEmptyWG,
        trueSvgPositions = params.trueSvgPositions;

    var barHeight = params.barHeight;

    var wgContainer = arGroup.append('g')
                        .attr('class', 'wgContainer')
                        .attr('id', 'ar' + ar + 'wg' + wg);

    //First we want to create a group for each chapter
    var chapterContainer = d3.select('#ar' + ar + 'wg' + wg)
                              .selectAll('.chapterContainer')
                              .data(chaptersWithWG);
    var chapterGroupEnter = chapterContainer.enter().append('g')
                              .attr('class', 'chapterContainer')
                              .attr('id', function(d,i) {
                                          return 'chapterContainerAR' + ar +
                                          'WG' + wg + 'Chap' + d.chapterName;
                                    });

    chapterGroupEnter.append('rect')
                    .attr('class', function(d, i) {
                        return 'totalWG'+ wg +
                               ' totalAR' + ar + 'WG' + wg;})
                    .attr('id', function(d,i){
                      return 'wg' + wg + 'chapter' + d.chapterName;
                    })
    chapterGroupEnter.append('rect')
                    .attr('class','partialWG'+ wg +
                                  ' partialAR' + ar + 'WG' + wg)
                    .attr('id', function(d,i){
                      return 'wg' + wg + 'chapter' + d.chapterName;
                    })


    d3.selectAll('.totalAR' + ar +'WG' + wg)
      .data(chaptersWithWG)
        .attr('y', params.spaceVertiUnit)
        .attr('x', params.xPosition)
        .attr('width', params.widthTotalBar)
        .attr('height', barHeight)
        .attr('class', function(d, i) {
          return 'totalWG'+ wg + ' totalAR' + ar +'WG' + wg + (d.wg.phantom ?
                                  ' phantomWG' + wg :
                                  '');
        });
    d3.selectAll('.partialAR' + ar +'WG' + wg)
        .data(chaptersWithWG)
        .attr('y', params.spaceVertiUnit)
        .attr('x', params.xPosition)
        .attr('width', function(d, i) {
          var scale = d3.scale.linear()
                        .range([0, params.widthTotalBar])
                        .domain([0, modifLog(params.widthTotalBar + 1)]);
          return scale(modifLog(d.wg.chapterEffective+1));
        })
        .attr('height', barHeight);

    //Then we want to translate them to their position
    chapterContainer
      .attr('transform', function(d, i) {
        return 'translate(0,' +
              ((params.yStartPosition -
                i * (barHeight + 2 * params.spaceVertiUnit))) + ')'})
    d3.selectAll('.chapterContainer')
      .on('mouseover', function(d,i) {
          drawToolTipHTML(svg, this, i, d, {container: params.container});
        })
        .on('mouseleave', function(d,i) {
          removeToolTip(svg, this);
        });
    chapterContainer.exit().remove();
  }

  //Creates the top AR bars
  function createARbar(chart, ar, params) {
    //Height
    var barHeight = params.barHeight;

    //Vertical start position
    var yPosition = params.margin.top + params.effHeight - (params.margin.bottom + 5*params.spaceVertiUnit);

    //Width of bar corresponding to all the participations worldwide
    var totalWidth = params.oneARwidth - 2 * params.spaceHoriUnit;

    var countryBarWidth = params.scaleX(modifLog(params.totalCountryAR+1));

    //Horizontal start position
    var xPosition = params.xStartPosition + params.spaceHoriUnit;

    //SVG's true position
    var trueSvgPositions = params.trueSvgPositions;

    d3.select('#ARparticipations' + ar).remove();
    var group = chart.append('g')
      .attr('class', 'ARparticipations')
      .attr('id', 'ARparticipations' + ar);
    //Appends the bars to the chart
    group.append('rect')
      .attr('class', 'participationTotalARbar')
      .attr('id', 'partTotalAR' + ar)
      .attr('x', xPosition)
      .attr('y', yPosition)
      .attr('height', barHeight)
      .attr('width', totalWidth);

    group.append('rect')
      .attr('class', 'participationCountryARbar')
      .attr('id', 'partCountryAR' + ar)
      .attr('x', xPosition)
      .attr('y', yPosition)
      .attr('height', barHeight)
      .attr('width', countryBarWidth);

    group.append('text')
      .attr('class', 'barTitle')
      .attr('x', xPosition + totalWidth/2)
      .attr('y', yPosition + barHeight + 5 * params.spaceVertiUnit)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging')
      .text('AR ' + ar);

    d3.select('#ARparticipations' + ar)
      .on('mouseover', function(d,i) {
          var data = {
            arNumber: ar,
            country: params.country,
            totalCountryAR: params.totalCountryAR,
            partTotalAR: params.partTotalAR
          }
          drawToolTipHTML(params.container, this, i, data, {container: params.container});
      })
      .on('mouseleave', function(d,i) {
        removeToolTip(params.container, this);
      });
  }

  //Returns the log of a number or 0 if this log is negative
  function modifLog(number) {
    return number < 1 ? 0 : Math.log(number);
  }

  function removeToolTip(container, bar) {
    d3.select('#tooltipContainer').remove();

    bar.setAttribute("class",
                     bar.getAttribute("class").replace(/ hoverBar/, ''));
  }

  function drawToolTipHTML(component, bar, id, data, complementary) {
    var trueSvgPositions = document.getElementById(complementary.container.replace('#',''))
                        .getBoundingClientRect();
    var country = data.country,
        ar = data.arNumber,
        wg = data.wgNumber,
        totalCountryAR = data.totalCountryAR,
        partTotalAR =  data.partTotalAR;

    //Remove the possibly existing tooltip
    d3.select('#tooltipContainer').remove();

    //Enables the styling with the hover
    bar.setAttribute("class", bar.getAttribute("class")+ ' hoverBar');

    if (data.chapterName !== undefined) {
      var chapterDescription = 'Chapter: ' + data.chapterTitle + ' (AR ' + ar + ' - WG ' + wg + ' - CH '+ data.chapterName + ')',
          partCountryDescription = data.wg.chapterEffective !== 0 ?
                    country + '\'s participations for this chapter: ' +
                              data.wg.chapterEffective:
                    country + ' did not participate in this chapter',
          partTotalDescription = 'All countries\' participations ' +
                                 'for this chapter: ' + data.wg.chapterTotal,
          noPartDescription = 'No information available about this chapter';
    }
    else if (totalCountryAR !== undefined) {
      var legend = country + (totalCountryAR === 0 ?
                                ' has not participated in AR ' + ar :
                                ' has participated ' + totalCountryAR +
                                (totalCountryAR === 1 ? ' time ' : ' times ') +
                                'in AR ' + ar);
      legend += '<br/> There are ' + partTotalAR + ' participations in total ' +
                ' for this AR.';

    }

    var boundingRectBar = bar.getBBox(),
        paddingText = {top: 5, left: 5};

    var trueY = data.chapterName !== undefined ?
                  + bar.getAttribute('transform')
                     .replace(/translate\(\d*,/,'').replace('\)','') :
                  0;
    d3.select('body')
      .append('div')
      .attr('id', 'tooltipContainer')
      .append('div')
      .attr('id', 'bricksTooltipText')
        .style('position', 'absolute')
        .style('padding', paddingText.top + 'px ' + paddingText.left + 'px')

    if (data.chapterName !== undefined) {
      if (data.wg.chapterTotal === 0)
        d3.select('#bricksTooltipText')
          .html(chapterDescription + '<br/>' +
                noPartDescription);
      else
        d3.select('#bricksTooltipText')
          .html(chapterDescription + '<br/>' +
                partCountryDescription + '<br/>' +
                partTotalDescription);
    }
    else if (totalCountryAR !== undefined) {
      d3.select('#bricksTooltipText')
        .html(legend);
    }
    var svgBbox = d3.select(component)[0][0].getBBox(),
        xMax = svgBbox.x + svgBbox.width,
        xMin = svgBbox.x;

    //Here we create an arrow of the given side
    var arrowSide = 8;
    d3.select('#tooltipContainer')
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
      .style('top', boundingRectBar.y + trueSvgPositions.top + trueY - arrowSide + 2 + 'px')


    //Text in the tooltip horizontal alignement if out of the svg on the right
    var tooltipWidth = document.getElementById('bricksTooltipText').clientWidth -
                       2 * paddingText.left,
        tooltipHeight = document.getElementById('bricksTooltipText').clientHeight -
                       2 * paddingText.top,
        xFinalText = boundingRectBar.x + boundingRectBar.width/2 +
                     tooltipWidth/2,
        xStartText = boundingRectBar.x + boundingRectBar.width/2 -
                     tooltipWidth/2;

    if (xFinalText >= xMax )
      d3.select('#bricksTooltipText')
        .style('left', trueSvgPositions.left + xStartText - (xFinalText - xMax) + 'px')
    else if (xStartText <= xMin)
      d3.select('#bricksTooltipText')
        .style('left', trueSvgPositions.left + xMin + 'px')
    else
      d3.select('#bricksTooltipText')
        .style('left', trueSvgPositions.left + Math.round(boundingRectBar.x +
                        boundingRectBar.width/2 - tooltipWidth/2) + 'px');

    d3.select('#bricksTooltipText')
      .style('top', trueSvgPositions.top + boundingRectBar.y + trueY -
                    tooltipHeight - 2*arrowSide + 'px')
  }

  // Exporting
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = Bricks;
    exports.Bricks = Bricks;
  } else if (typeof define === 'function' && define.amd)
    define('Bricks', [], function() {
      return Bricks;
    });
  else
    this.Bricks = Bricks;

}).call(this);
