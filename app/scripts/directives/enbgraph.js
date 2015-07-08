'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:enbgraph
 * @description
 * # enbgraph
 * gexf attribute is a relativ path to the gexf file
 */
angular.module('driveoutApp.directives.enb', [])
  .directive('enbgraph', function () {
    return {
      restrict: 'EA',
      scope: {
        gexf: '@'
      },
      link: function postLink(scope, element, attrs) {
        var enb = new ENBGraph(element[0]);

        // Loading graph
        enb.load(scope.gexf, null, function() {
        });

        scope.$on('focus', function(e, string) {
          var group = string.split(',');

          if (group.length < 2) {

            // Focusing on a single node
            enb.focusOnNodeByLabel(group[0]);
          }
          else {

            // Focusing on a group of nodes
            enb.focusOnGroupByLabels(group);
          }
        });

        scope.$on('updateView', function(event, index) {
          switch(index) {
            case 0:
              // Default view, reset zoom
              enb.resetFocus();
              break;
            case 1:
              // Zoom on cluster 'Climate Expertise'
              enb.focusOnGroupByCluster(['Climate Expertise']);
              break;
            case 2:
              // Zoom on clusters 'Reducing GHGs Emissions' and 'Reduction commitments'
              enb.focusOnGroupByCluster(['Reducing GHGs Emissions', 'Emission Reduction Commitments']);
              break;
            case 3:
              // Zoom on clusters 'Technology transfer & energy' and 'Fuels and transport sector'
              enb.focusOnGroupByCluster(['Technology transfer and energy', 'Fuels and transports']);
              break;
            case 4:
              // Zoom on cluster 'Clean Development Mechanism'
              enb.focusOnGroupByCluster(['Clean Development Mechanism']);
              break;
            case 5:
              // Zoom on cluster 'Land use & forestry' and 'Post-2012, mitigation and new funding pledges'
              enb.focusOnGroupByCluster(['Land use and forestry', 'Post-2012, mitigation and new funding pledges']);
              break;
            case 6:
              // Zoom on cluster 'Climate change impacts and development', 'Vulnerability and adaptation' and 'Adaptation funding'
              enb.focusOnGroupByCluster(['Climate change impacts and development', 'Vulnerability and adaptation policy', 'Adaptation funding']);
              break;
            default:
              break;
          }
        });

      }
    };
  });
