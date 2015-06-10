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
  .module('driveoutApp', [
    //'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: 'home'});
          }
        }
      })
      .when('/404', {
        templateUrl: 'views/404.html',
        controller: '404Ctrl'
      })
      .when('/:page', { // static page controller
        templateUrl: 'views/page.html',
        controller: 'PageCtrl',
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: $route.current.params.page + '/introduction'});
          }
        }
      })
      .when('/:page/:sub', {
        templateUrl: 'views/page.html',
        controller: 'PageCtrl', // handle the items loading
        resolve: {
          content : function ($route, FilesFactory) {
            return FilesFactory.get({path: $route.current.params.page + '/' + $route.current.params.sub});
          }
        }
      })
      .otherwise({
        redirectTo: '/404'
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
