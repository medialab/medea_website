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
      }
    };
  });
