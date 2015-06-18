'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:ipccwgvenn
 * @description
 * # ipccwgvenn
 */
angular.module('driveoutApp.directives.wenn', [])
  .directive('ipccwgvenn', function () {
    return {
      restrict: 'EA',
      scope: {
        path: '='
      },
      link: function postLink(scope, element, attrs) {

        var elementid, elementwidth, elementheight;

        venn.load_data('contents/data/ipcc-wg-venn/authors-by-wg-by-ar-venn.json', function() {
          elementid = "#"+element[0].getAttribute("id"),
          elementwidth = element.width(),
          elementheight = element.height()-50;
          venn.plotGlobalAR(elementid, elementwidth, elementheight);
        });

        scope.$on('focus', function(e, string) {
          console.log('focus', string)
          if (string === "global") {
            element.html("");
            venn.plotGlobalAR(elementid, elementwidth, elementheight);
          } else if (string === "annual") {
            element.html("");
            venn.plotAnnualARs(elementid, elementwidth, elementheight);
          }
        });

      }
    };
  });
