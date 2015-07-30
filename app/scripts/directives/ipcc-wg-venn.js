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
          elementheight = element.height()-$('.vizLegendZone').height();
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
        $($('.buttonFocus')[1]).prop('disabled', true)
        scope.$on('focus', function(e, string) {
          if (string === "global") {
            element.html("");
            $($('.buttonFocus')[0]).prop('disabled', false)
            $($('.buttonFocus')[1]).prop('disabled', true)
            element[0].setAttribute('class', element[0].getAttribute('class').replace('fillHeight', 'fillComplement'));
            venn.plotGlobalAR(elementid, elementwidth, elementheight);
          } else if (string === "annual") {
            $($('.buttonFocus')[1]).prop('disabled', false)
            $($('.buttonFocus')[0]).prop('disabled', true)
            element.html("");
            elementheight = element.height()-$('.vizLegendZone').height() - 30;
            element[0].setAttribute('class', element[0].getAttribute('class').replace('fillComplement', 'fillHeight'));
            venn.plotAnnualARs(elementid, elementwidth, elementheight);
          }
        });

      }
    };
  });
