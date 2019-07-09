'use strict';

/**
 * @ngdoc service
 * @name driveoutApp.files
 * @description
 * # files
 * Factory in the driveoutApp.
 */
angular.module('driveoutApp.files', [])
  .factory('FilesFactory', function($http){
    return {
        get: function(options) {
          return $http.get('contents/'+ options.path +'.json');
        }
    };/*function($resource) {
    return $resource('/contents/:path.json',{ }, {
      get: {method:'GET', isArray: true, params: {path: '@path'} },
    });*/
  })
  /*
    get data from svg data
  */
  .factory('HTMLFactory', function($http) {
    return {
        get: function(options) {
          return $http.get(options.path);
        }
    };
  });
