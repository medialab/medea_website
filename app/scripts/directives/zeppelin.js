'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:zeppelin
 * @description
 * # zeppelin
 */
angular.module('driveoutApp')
  .directive('zeppelin', function ($window) {
    return {
      templateUrl: 'views/directives/zeppelin.html',
      scope:{
        sections: '='
      },
      link: function postLink(scope, element, attrs) {
  
        var w = angular.element($window); console.log(scope.sections);
        
        

  


        //element.text('this is the zeppelin directive' + scope.h);

       

        function resize(){
          var h = (w.height() - 250)+ 'px';
          console.log('/ zeppelin ---> ',h)
          element.css({
            height: h
          })
        };

        w.bind('resize', resize);
        resize();
      }
    };
  });
