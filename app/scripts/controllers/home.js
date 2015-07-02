'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.home', [])
  .controller('HomeCtrl', function ($scope, contentHome, contentIPCC, contentUNFCCC) {
    $('html, body').scrollTop(0);
    $scope.content = contentHome.data;
    $scope.contentStudies = {ipcc: contentIPCC.data};
    // $scope.contentUNFCCC = contentUNFCCC.data;
    console.log('home content', contentHome, contentIPCC)
    $scope.$parent.page = {};

    $scope.$watch('routes', function(r){
      // get my pag
    })
  });
