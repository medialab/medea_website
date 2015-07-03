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

        window.addEventListener('resize', function() {
          if (element.width() !== 0) {
            venn.load_data('contents/data/ipcc-wg-venn/authors-by-wg-by-ar-venn.json', function() {
              elementid = "#"+element[0].getAttribute("id"),
              elementwidth = element.width(),
              elementheight = element.height()-50;
              var el = element[0];

              if (element[0].lastChild !== null) {
                var lastChildClass = element[0].lastChild.getAttribute('class');
                while (el.firstChild) {
                  el.removeChild(el.firstChild);
                }
                if (lastChildClass !== null) {
                  element.html("");
                  element[0].setAttribute('class', element[0].getAttribute('class').replace('fillHeight', 'fillComplement'));
                  venn.plotGlobalAR(elementid, elementwidth, elementheight);
                }
                else {
                  element.html("");
                  element[0].setAttribute('class', element[0].getAttribute('class').replace('fillComplement', 'fillHeight'));
                  venn.plotAnnualARs(elementid, elementwidth, elementheight);
                }
              }
            });
          }
        });

        scope.$on('focus', function(e, string) {
          console.log('focusEvent',e);
          if (string === "global") {
            element.html("");
            element[0].setAttribute('class', element[0].getAttribute('class').replace('fillHeight', 'fillComplement'));
            venn.plotGlobalAR(elementid, elementwidth, elementheight);
          } else if (string === "annual") {
            element.html("");
            element[0].setAttribute('class', element[0].getAttribute('class').replace('fillComplement', 'fillHeight'));
            venn.plotAnnualARs(elementid, elementwidth, elementheight);
          }
        });

      }
    };
  });
