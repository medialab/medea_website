'use strict'

angular.module('driveoutApp.directives.topmenu', [])
  .directive('topMenu', function () {
    return {
      controller: 'TopMenu',
      templateUrl: 'views/templates/topMenu.html'
    };
  });
