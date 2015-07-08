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
    'driveoutApp.page',
    'driveoutApp.singlepage',
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
            return FilesFactory.get({path: 'unfccc/introduction-and-methodology'});
          },
          scrollToStoryLines: function() {
            return false;
          }
        }
      })
      .when('/storylines', {
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
            return FilesFactory.get({path: 'unfccc/introduction-and-methodology'});
          },
          scrollToStoryLines: function() {
            return true;
          }
        }
      })
      .when('/404', {
        templateUrl: 'views/404.html',
        controller: '404Ctrl'
      })
      .when('/about', { // static page controller
        templateUrl: 'views/singlepage.html',
        controller: 'SinglePageCtrl'
      })
      .when('/foreword', { // static page controller
        templateUrl: 'views/singlepage.html',
        controller: 'SinglePageCtrl',
        resolve: {
          content: function(FilesFactory) {
            return FilesFactory.get({path:'foreword'});
          }
        }
      })
      .when('/ipcc', {
        redirectTo: '/storylines'
      })
      .when('/unfccc', {
        redirectTo: '/storylines'
      })
      .when('/controversy-mapping', { // static page controller
        templateUrl: 'views/singlepage.html',
        controller: 'SinglePageCtrl'
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
      .when('/unfccc/the-thematic-space-of-negotiations', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'unfccc/the-thematic-space-of-negotiations'});
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
