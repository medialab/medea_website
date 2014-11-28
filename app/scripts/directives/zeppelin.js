'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:zeppelin
 * @description The directove of directives
 * # zeppelin
 */
angular.module('driveoutApp')
  .filter('unsafe', function($sce) { return $sce.trustAsHtml; })
  .directive('zeppelin', function($window, $log, $timeout) {
    return {
      templateUrl: 'views/directives/zeppelin.html',
      scope:{
        sections: '='
      },
      link: function postLink(scope, element, attrs) {
        $log.debug("\n\nZEPPELIN - the magic directive");
        var w = angular.element($window);
        element.on('click', '[data-click]', function(e) {
          $log.info('clicked on ', angular.element(e).data('data-click'), arguments)
        })
        scope.h = 0;
        
        console.log();

        scope.index  = 0; // current section index, cfr params otherwise

        // goto next slide
        scope.next = function() {
          var _index = scope.index + 1;
          scope.index = Math.min(_index, scope.sections.length -1);
          $log.info('next slide', scope.index, '/', scope.sections.length - 1, -scope.index * scope.h);
          scope.section = scope.sections[scope.index];
          element.find('.slider').css({
            top: -scope.index * scope.h
          })
        };
        
        // goto previous slide
        scope.previous = function() {
          var _index = scope.index - 1;
          scope.index = Math.max(_index, 0);
          $log.info('next slide', scope.index, '/', scope.sections.length - 1);
          scope.steer(scope.index);

          //scope.section = scope.sections[scope.index];
          
          
        };

        /*
          Goto a specific slide. If the section directive names has the 'follow' prefix,
          we do not substitute the current section in playground, but
          we 'inject' preliminary params instead. This function handle the 
          the section scrolling inside the slider as well.
        */
        scope.steer = function(index) {
          element.find('.slider').css({
            top: -scope.index * scope.h
          });
          scope.section = scope.sections[scope.index];
        };

        
        /*
          Once timed properly, this funciton resize the szeppelin working area
          (fixing the height porperty according to window height props)
        */
        function resize() {
          scope.h = (w.height() - 250);
          console.log('/ zeppelin ---> ',scope.h)
          element.css({
            height: scope.h
          })
        };

        w.bind('resize', resize);
        resize();
      }
    };
  })
  ;
