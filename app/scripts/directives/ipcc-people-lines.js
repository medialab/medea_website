'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:ipccpeoplelines
 * @description
 * # ipcc-wg-venn
 */
angular.module('driveoutApp.directives.peoplelines', [])
  .directive('ipccpeoplelines', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {
        var elementwidth = element.width() * 9.5/10,
            opts = '',
            select = document.querySelector('#lines-countries-choice'),
            sort = document.querySelector('#lines-countries-order'),
            viz = new IPCCPeopleLines();

        viz.load_countries('contents/data/people-countries/countries.json', function() {

          // populate dropdown list of countries
          viz.listCountries.forEach(function(c) {
            opts += '<option ' + (c === viz.defaultCountry ? 'selected="selected" ' : '') + 'value="' + c + '">' + c + '</option>\n';
          });
          select.innerHTML = opts;

          select.onchange = sort.onchange = function(e) {
            viz.load_country(select.value, "contents//data/people-countries", function() {
              viz.draw_country("#lines-countries-viz", select.value, sort.value,
                {
                  width: elementwidth,
                  lineHeight: 15,
                  lineMargin: {top: 2, bottom: 2, left: 0, right: 0}
                });
            });
          };
          select.onchange();
        });

      }
    };
  });
