'use strict'

angular.module('driveoutApp')
  .directive('subchapters', function () {
    return {
      templateUrl: 'views/templates/subchapters.html',
      controller: 'SubchapterCtrl'
    };
  });
