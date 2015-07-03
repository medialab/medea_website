'use strict';

/**
 * @ngdoc overview
 * @name driveoutApp
 * @description
 * # driveoutApp
 *
 * Main module of the application.
 */
angular
  .module('driveoutApp.global', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'ngTouch',
    'driveoutApp.404',
    'driveoutApp.about',
    'driveoutApp.content',
    'driveoutApp.depth',
    'driveoutApp.layout',
    'driveoutApp.home',
    'driveoutApp.main',
    'driveoutApp.page',
    'driveoutApp.topmenu',
    'driveoutApp.subchapter',
    'driveoutApp.directives',
    'driveoutApp.files',
    'driveoutApp.filters'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        resolve: {
          contentHome : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'home'});
          },
          contentIPCC: function(FilesFactory) {
            return FilesFactory.get({path: 'ipcc/mapping-the-organizational-dynamics-of-the-ipcc'});
          },
          contentUNFCCC: function(FilesFactory) {
            // return FilesFactory.get({path: 'unfccc/introduction'});
          }
        }
      })
      .when('/404', {
        templateUrl: 'views/404.html',
        controller: '404Ctrl'
      })
      .when('/about', { // static page controller
        templateUrl: 'views/page.html',
        controller: 'PageCtrl'
      })
      .when('/forword', { // static page controller
        templateUrl: 'views/page.html',
        controller: 'PageCtrl'
      })
      .when('/controversy-mapping', { // static page controller
        templateUrl: 'views/page.html',
        controller: 'PageCtrl'
      })
      .when('/ipcc/national-cultures-of-climate-expertise-france', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'ipcc/national-cultures-of-climate-expertise-france'});
          }
        }
      })
      .when('/ipcc/coordination-and-controversy', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'ipcc/coordination-and-controversy'});
          }
        }
      })
      .when('/ipcc/diversity', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'ipcc/diversity'});
          }
        }
      })
      .when('/ipcc/introduction', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'ipcc/introduction'});
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
    $('.close-menu').click(
      function() {
        $("#wrapper").toggleClass("toggled");
        $('.menu').show();
      }
    );
    $('.menu').click(
      function() {
        $('.menu').hide();
        $("#wrapper").toggleClass("toggled");
      }
    );
  })
