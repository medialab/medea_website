'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.home', [])
  .controller('HomeCtrl', function ($scope, $window,$location,$anchorScroll,$timeout, contentHome, contentIPCC, contentUNFCCC, scrollToStoryLines) {
    if (scrollToStoryLines === undefined)
      scrollToStoryLines = false;

    $('html, body').scrollTop(0);

    if (scrollToStoryLines) {
      $scope.unsubscribeContentListener = $scope.$on('lastngrepeatdone', function(e) {
        var abstractStudies = $('#studiesAbstract'),
            scroll = abstractStudies.offset().top + abstractStudies.height() - 60;
        $('html, body').scrollTop(scroll);
      });
    }
    else if ($scope.unsubscribeContentListener !== undefined) {
      $scope.unsubscribeContentListener();
    }
    $scope.content = contentHome.data;
    $scope.contentStudies = {ipcc: contentIPCC.data, unfccc: contentUNFCCC.data};
    $scope.$parent.page = {};

    $anchorScroll.yOffset = 70;

    if($location.hash())
      $timeout(function() {
        $anchorScroll()
      });

    $scope.anchorScrollTo = function(id) {
      $location.hash(id);
      $timeout(function() {
        $anchorScroll()
      });
    };

  });
