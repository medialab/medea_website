'use strict'

angular.module('driveoutApp.directives.unfccctrajectoriesadaptation', [])
  .directive('unfccctrajectoriesadaptation', function () {
    return {
      link: function(scope, element) {
        var categoryColors = {
          adaptation: '#71b36a',
          mitigation: '#a93f23',
          other: '#4094b4'
        },
          horiCatNumber = 21,
          vertiCatNumber = 12;
        drawHeatmap();
        window.addEventListener('resize', function() {
          if (element.height() > 0)
            drawHeatmap();
            highlightOnResize(scope.index)
        });
        scope.index = 0;

        scope.$on('updateView', function(event, index) {
          highlightOnResize(index);
        });

        function drawHeatmap() {
          $('#vizContainer').highcharts({

            chart: {
                type: 'heatmap',
                marginTop: 10,
                borderColor: '#2F5B66',
                marginLeft: 200,
                marginRight: 10,
                height: $('.vizLegendZone').position().top -15,
                marginBottom: 110
            },

            plotOptions: {
              heatmap: {
                borderColor: '#2F5B66',
                borderWidth: 1
              }
            },
            title: {
              text: null
            },

            xAxis: {
              categories: ['INC 11 - New York',
                    'COP 01 - Berlin Mandate',
                    'COP 02 - Geneva',
                    'COP 03 - Kyoto',
                    'COP 04 - Buenos Aires',
                    'COP 05 - Bonn',
                    'COP 06 - The Hague',
                    'COP 06bis - Bonn',
                    'COP 07 - Marrakech',
                    'COP 08 - New Delhi',
                    'COP 09 - Milan',
                    'COP 10 - Buenos Aires',
                    'COP 11 - Montreal',
                    'COP 12 - Nairobi',
                    'COP 13 - Bali',
                    'COP 14 - Poznan',
                    'COP 15 - Copenhagen',
                    'COP 16 - Cancun',
                    'COP 17 - Durban',
                    'COP 18 - Doha',
                    'COP 19 - Warsaw']
            },

            yAxis: {
                categories: ['<tspan class="adaptationUNFCCC">Adaptation Funding</tspan>',
                    '<tspan class="adaptationUNFCCC">Vulnerability & Adaptation Policy</tspan>',
                    '<tspan class="adaptationUNFCCC">Climate Change Impacts & Development</tspan>',
                    '<tspan class="mitigationUNFCCC">Emission Reduction Commitments</tspan>',
                    '<tspan class="mitigationUNFCCC">Reducing GHGs Emission</tspan>',
                    '<tspan class="mitigationUNFCCC">Technology Transfer & Energy</tspan>',
                    '<tspan class="mitigationUNFCCC">Clean Development Mechanism</tspan>',
                    '<tspan class="mitigationUNFCCC">Fuels & Transport</tspan>',
                    '<tspan class="mitigationUNFCCC">Land Use and Forestry</tspan>',
                    '<tspan class="mitigationUNFCCC">Compliance & Enforcement</tspan>',
                    '<tspan class="mitigationUNFCCC">Post-2012 Mitigation</tspan>',
                    '<tspan class="otherUNFCCC">Climate Expertise</tspan>'],
                title: null,
                labels: {
                  useHTML: false,
                  textAlign: 'right',
                  formatter: function() {
                    if (this.value.search('adaptationUNFCCC') !== -1)
                      return this.value.replace(/class="adaptationUNFCCC"/, 'style="color: ' + categoryColors.adaptation + '"');

                    else if (this.value.search('mitigationUNFCCC') !== -1)
                      return this.value.replace(/class="mitigationUNFCCC"/, 'style="color: ' + categoryColors.mitigation + '"');

                    else if (this.value.search('otherUNFCCC') !== -1)
                      return this.value.replace(/class="otherUNFCCC"/, 'style="color: ' + categoryColors.other + '"');
                    else
                      return this.value;
                  }
                }
            },

            colorAxis: {
                min: 0,
                minColor: '#2F5B66',
                maxColor: '#FFFFFF',
            },

            legend: {
                enabled: false,
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                itemDistance: 50,
                symbolHeight: 280
            },

            tooltip: {
                formatter: function () {
                    return  'The topic <b>' +
                            this.series.yAxis.categories[this.point.y] +
                            '</b><br/> was the <b>' + ordinalNumber(this.point.value) +
                            '</b> most visible topic' +
                            '<br/> in <b>' + this.series.xAxis.categories[this.point.x] +
                            '</b> negotiations'    ;
                }
            },

            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                data: [
                    [0, 0, 1],
                    [0, 1, 7],
                    [0, 2, 10],
                    [0, 3, 9],
                    [0, 4, 2],
                    [0, 5, 3],
                    [0, 6, 8],
                    [0, 7, 5],
                    [0, 8, 6],
                    [0, 9, 11],
                    [0, 10, 11],
                    [0, 11, 4],
                    [1, 0, 3],
                    [1, 1, 8],
                    [1, 2, 5],
                    [1, 3, 9],
                    [1, 4, 2],
                    [1, 5, 1],
                    [1, 6, 11],
                    [1, 7, 6],
                    [1, 8, 7],
                    [1, 9, 10],
                    [1, 10, 11],
                    [1, 11, 4],
                    [2, 0, 2],
                    [2, 1, 8],
                    [2, 2, 7],
                    [2, 3, 3],
                    [2, 4, 4],
                    [2, 5, 1],
                    [2, 6, 9],
                    [2, 7, 6],
                    [2, 8, 9],
                    [2, 9, 11],
                    [2, 10, 11],
                    [2, 11, 4],
                    [3, 0, 5],
                    [3, 1, 8],
                    [3, 2, 7],
                    [3, 3, 1],
                    [3, 4, 2],
                    [3, 5, 3],
                    [3, 6, 8],
                    [3, 7, 8],
                    [3, 8, 4],
                    [3, 9, 8],
                    [3, 10, 12],
                    [3, 11, 6],
                    [4, 0, 4],
                    [4, 1, 9],
                    [4, 2, 7],
                    [4, 3, 2],
                    [4, 4, 7],
                    [4, 5, 1],
                    [4, 6, 3],
                    [4, 7, 12],
                    [4, 8, 5],
                    [4, 9, 10],
                    [4, 10, 11],
                    [4, 11, 5],
                    [5, 0, 3],
                    [5, 1, 9],
                    [5, 2, 11],
                    [5, 3, 10],
                    [5, 4, 7],
                    [5, 5, 1],
                    [5, 6, 4],
                    [5, 7, 8],
                    [5, 8, 5],
                    [5, 9, 2],
                    [5, 10, 12],
                    [5, 11, 6],
                    [6, 0, 1],
                    [6, 1, 7],
                    [6, 2, 10],
                    [6, 3, 6],
                    [6, 4, 8],
                    [6, 5, 2],
                    [6, 6, 4],
                    [6, 7, 11],
                    [6, 8, 3],
                    [6, 9, 5],
                    [6, 10, 12],
                    [6, 11, 9],
                    [7, 0, 2],
                    [7, 1, 8],
                    [7, 2, 10],
                    [7, 3, 7],
                    [7, 4, 6],
                    [7, 5, 4],
                    [7, 6, 3],
                    [7, 7, 11],
                    [7, 8, 1],
                    [7, 9, 4],
                    [7, 10, 12],
                    [7, 11, 9],
                    [8, 0, 2],
                    [8, 1, 9],
                    [8, 2, 8],
                    [8, 3, 11],
                    [8, 4, 6],
                    [8, 5, 5],
                    [8, 6, 1],
                    [8, 7, 10],
                    [8, 8, 3],
                    [8, 9, 4],
                    [8, 10, 12],
                    [8, 11, 6],
                    [9, 0, 1],
                    [9, 1, 8],
                    [9, 2, 7],
                    [9, 3, 9],
                    [9, 4, 3],
                    [9, 5, 2],
                    [9, 6, 4],
                    [9, 7, 10],
                    [9, 8, 5],
                    [9, 9, 11],
                    [9, 10, 12],
                    [9, 11, 6],
                    [10, 0, 1],
                    [10, 1, 7],
                    [10, 2, 7],
                    [10, 3, 10],
                    [10, 4, 6],
                    [10, 5, 2],
                    [10, 6, 4],
                    [10, 7, 9],
                    [10, 8, 3],
                    [10, 9, 11],
                    [10, 10, 11],
                    [10, 11, 5],
                    [11, 0, 2],
                    [11, 1, 3],
                    [11, 2, 6],
                    [11, 3, 10],
                    [11, 4, 7],
                    [11, 5, 1],
                    [11, 6, 5],
                    [11, 7, 9],
                    [11, 8, 4],
                    [11, 9, 11],
                    [11, 10, 11],
                    [11, 11, 7],
                    [12, 0, 1],
                    [12, 1, 4],
                    [12, 2, 8],
                    [12, 3, 6],
                    [12, 4, 5],
                    [12, 5, 3],
                    [12, 6, 2],
                    [12, 7, 10],
                    [12, 8, 7],
                    [12, 9, 10],
                    [12, 10, 12],
                    [12, 11, 8],
                    [13, 0, 1],
                    [13, 1, 2],
                    [13, 2, 11],
                    [13, 3, 8],
                    [13, 4, 5],
                    [13, 5, 4],
                    [13, 6, 2],
                    [13, 7, 10],
                    [13, 8, 7],
                    [13, 9, 12],
                    [13, 10, 9],
                    [13, 11, 6],
                    [14, 0, 1],
                    [14, 1, 4],
                    [14, 2, 10],
                    [14, 3, 9],
                    [14, 4, 8],
                    [14, 5, 2],
                    [14, 6, 5],
                    [14, 7, 10],
                    [14, 8, 7],
                    [14, 9, 12],
                    [14, 10, 3],
                    [14, 11, 6],
                    [15, 0, 1],
                    [15, 1, 3],
                    [15, 2, 9],
                    [15, 3, 7],
                    [15, 4, 10],
                    [15, 5, 5],
                    [15, 6, 4],
                    [15, 7, 12],
                    [15, 8, 6],
                    [15, 9, 11],
                    [15, 10, 2],
                    [15, 11, 8],
                    [16, 0, 2],
                    [16, 1, 7],
                    [16, 2, 9],
                    [16, 3, 3],
                    [16, 4, 6],
                    [16, 5, 8],
                    [16, 6, 5],
                    [16, 7, 11],
                    [16, 8, 4],
                    [16, 9, 12],
                    [16, 10, 1],
                    [16, 11, 10],
                    [17, 0, 2],
                    [17, 1, 7],
                    [17, 2, 8],
                    [17, 3, 1],
                    [17, 4, 9],
                    [17, 5, 4],
                    [17, 6, 5],
                    [17, 7, 10],
                    [17, 8, 6],
                    [17, 9, 10],
                    [17, 10, 3],
                    [17, 11, 12],
                    [18, 0, 1],
                    [18, 1, 7],
                    [18, 2, 8],
                    [18, 3, 3],
                    [18, 4, 10],
                    [18, 5, 6],
                    [18, 6, 5],
                    [18, 7, 9],
                    [18, 8, 4],
                    [18, 9, 12],
                    [18, 10, 2],
                    [18, 11, 11],
                    [19, 0, 3],
                    [19, 1, 9],
                    [19, 2, 4],
                    [19, 3, 1],
                    [19, 4, 7],
                    [19, 5, 5],
                    [19, 6, 6],
                    [19, 7, 10],
                    [19, 8, 8],
                    [19, 9, 11],
                    [19, 10, 2],
                    [19, 11, 12],
                    [20, 0, 3],
                    [20, 1, 9],
                    [20, 2, 4],
                    [20, 3, 7],
                    [20, 4, 8],
                    [20, 5, 2],
                    [20, 6, 5],
                    [20, 7, 12],
                    [20, 8, 6],
                    [20, 9, 11],
                    [20, 10, 1],
                    [20, 11, 9]],
                dataLabels: {
                    enabled: false
                }
            }]
          });
          $('#highcharts-0').css({
            'position': 'absolute',
            'bottom': (element.height()- $('.vizLegendZone').position().top - 5)+ 'px',
            'margin-bottom': 30 + 'px'
          });
        }
        function ordinalNumber(number) {
          var correspondancy = {
            1: '1st',
            2: '2nd',
            3: '3rd'
          };
          if (correspondancy[number] !== undefined)
            return correspondancy[number];
          else
            return number + 'th';
        }
        function highlightLine(lineIndex) {
          var rects = $('.highcharts-series rect');

          if (typeof lineIndex === 'number')
            lineIndex = [lineIndex];

          for (var column = 0; column < horiCatNumber; column++) {

            for (var line = 0; line < vertiCatNumber; line++) {
              if (lineIndex.indexOf(line) === -1)
                $(rects[vertiCatNumber * column + line%vertiCatNumber]).css({
                  'opacity': '0.4'
                });
              else {
                $(rects[vertiCatNumber * column + line%vertiCatNumber]).css({
                  'opacity': '1'
                });
              }
            }
          }
        }
        function removeHighlight() {
          var rects = $('.highcharts-series rect');

          for (var column = 0; column < horiCatNumber; column++) {
            var nbCompleteLines = column;

            for (var line = 0; line < vertiCatNumber; line++) {
                $(rects[vertiCatNumber * column + line%vertiCatNumber]).css({
                  'opacity': '1'
                });
            }
          }
        }
        function highlightOnResize(index) {
          scope.index = index;
          switch(index) {
            case 0:
              removeHighlight();
              // Default view, reset zoom
              break;
            case 1:
              // Zoom on cluster 'Climate Expertise'
              highlightLine(0);
              break;
            case 2:
              highlightLine([1,2]);
              break;
            case 3:
              highlightLine(4);
              break;
            case 4:
              highlightLine([5,7]);
              break;
            case 5:
              highlightLine(8);
              break;
            case 6:
              highlightLine([0,6]);
              break;
            case 7:
              highlightLine(1);
              break;
            default:
              break;
          }
        }
      }
    };
  });
