'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.home', [])
  .config( ['$anchorScrollProvider',
    function($anchorScrollProvider) {
        $anchorScrollProvider.disableAutoScrolling();
    }]
  )
  .controller('HomeCtrl', function ($scope, $window, $location, $anchorScroll, $timeout, contentHome, contentIPCC, contentUNFCCC, scrollToStoryLines) {
    if (scrollToStoryLines === undefined)
      scrollToStoryLines = false;

    $anchorScroll.yOffset = 70;

    if ($location.hash() !== '') {
      $scope.unsubscribeContentListener = $scope.$on('lastngrepeatdone', function(e) {
        $timeout(function() {
          $anchorScroll($location.hash());
          $scope.unsubscribeContentListener();
        });
      });
    }

    $scope.content = contentHome.data;
    $scope.contentStudies = {ipcc: contentIPCC.data, unfccc: contentUNFCCC.data};
    $scope.$parent.page = {};


    $scope.anchorScrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
    };

  });
