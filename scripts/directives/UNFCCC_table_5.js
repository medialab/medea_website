'use strict'

angular.module('driveoutApp.directives.unfccctablefive', [])
  .directive('unfccctablefive', function () {
    return {
      templateUrl: 'views/templates/UNFCCC_table_5.html',
      link: function postLink(scope, element) {
        //Build the table to have the header fixed
        $('#tableDivContainer.scrollableOverlay').css({
          'max-height': element.height() - $('.tableHeader').height() - 10 + 'px'
        });
        window.addEventListener('resize', function() {
          $('#tableDivContainer.scrollableOverlay').css({
            'max-height': element.height() - $('.tableHeader').height() - 10 + 'px'
          });
        });
      }
    };
  });
