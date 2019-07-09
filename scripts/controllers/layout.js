'use strict';

/**
 * @ngdoc function
 * @name driveoutApp.controller:LayoutCtrl
 * @description
 * # LayoutCtrl
 * Controller of the driveoutApp
 */
angular.module('driveoutApp.layout', [])
  .controller('LayoutCtrl', function ($scope, $route, FilesFactory) {
    if (window.innerHeight >= 500 && window.innerWidth >= 800) {
      $('#contentBlocker').addClass('displayNone')
    }
    else {
      $('#contentBlocker').removeClass('displayNone')
      $('body').addClass('noScroll')
    }
    window.addEventListener('resize', function() {
      if (window.innerHeight >= 500 && window.innerWidth >= 800 && !$('#contentBlocker').hasClass('displayNone')) {
        $('#contentBlocker').addClass('displayNone')
        $('body').removeClass('noScroll')
      }
      else if ((window.innerHeight < 500 || window.innerWidth < 800) && $('#contentBlocker').hasClass('displayNone')) {
        $('#contentBlocker').removeClass('displayNone')
        $('body').addClass('noScroll')
      }
    })
    $scope.page = {};

    // inner pages
    $scope.pages  = [];
    $scope.routes = [];

    //Stores the folders (routes) and the pages (pages) in the layout scope
    FilesFactory.get({path: 'index'}).then(function (res) {
      var routes,
          pages;

      routes = res.data.filter(function (d) {
        if(d.type === 'folder')
          return d
      });

      pages = res.data.filter(function (d) {
        if(d.type !== 'folder')
          return d
      });

      $scope.pages = pages;
      $scope.routes = routes;

    });
    $scope.slugify = function(text) {
      return text.toString().toLowerCase()
        .replace(/[\s_]+/g, '-')           // Replace spaces and underscore with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    };
  });
