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
      .when('/404', {
        templateUrl: 'views/404.html',
        controller: '404Ctrl'
      })
      .when('/about', { // static page controller
        templateUrl: 'views/singlepage.html',
        controller: 'SinglePageCtrl',
        resolve: {
          content: function(FilesFactory) {
            return FilesFactory.get({path: 'about'});
          }
        }
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
      .when('/controversy-mapping', { // static page controller
        templateUrl: 'views/singlepage.html',
        controller: 'SinglePageCtrl',
        resolve: {
          content: function(FilesFactory) {
            return FilesFactory.get({path:'controversy-mapping'});
          }
        }
      })
      .when('/ipcc/national-cultures-of-climate-expertise', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'ipcc/national-cultures-of-climate-expertise-france'});
          }
        }
      })
      .when('/ipcc/coordination-and-controversy-in-the-ipcc', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'ipcc/coordination-and-controversy'});
          }
        }
      })
      .when('/ipcc/participation-and-politics-in-the-ipcc', {
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
      .when('/unfccc/introduction', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'unfccc/introduction-and-methodology'});
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
      .when('/unfccc/visualizing-the-trajectories-of-adaptation-in-the-unfccc', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'unfccc/trajectories-of-adaptation'});
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
