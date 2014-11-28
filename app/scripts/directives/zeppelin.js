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
      controller: function($scope, $element, $attrs, $log) {
        var w = angular.element($window);

        $log.debug('go zeeppelin go', $scope.sections);
        $scope.index = 0;
        $scope.height = w.height() - 250;

        $scope.next = function() {
          var _index = $scope.index + 1;
          $scope.index = Math.min(_index, $scope.sections.length -1);
          $log.info('next slide', $scope.index, '/', $scope.sections.length - 1, -$scope.index * $scope.height);
          $scope.steer($scope.index);
        };
        
        // goto previous slide
        $scope.previous = function() {
          var _index = $scope.index - 1;
          $scope.index = Math.max(_index, 0);
          $log.info('next slide', $scope.index, '/', $scope.sections.length - 1);
          $scope.steer($scope.index);
        };

        
        /*
          Goto a specific slide. If the section directive names has the 'follow' prefix,
          we do not substitute the current section in playground, but
          we 'inject' preliminary params instead. This function handle the 
          the section scrolling inside the slider as well.
        */
        $scope.steer = function(index){
          if($scope.sections[$scope.index]){
            $scope.section = $scope.sections[$scope.index];
          }
        };

        /*
          Once timed properly, this funciton resize the szeppelin working area
          (fixing the height porperty according to window height props)
        */
        w.on('resize', function () {
          $scope.height = w.height() - 250;
          $scope.$apply()
        });
        
      },
      link: function postLink(scope, element, attrs) {
        $log.debug("\n\nZEPPELIN - the magic directive");
        element.on('click', '[data-click]', function(e) {
          $log.info('clicked on ', $(this).attr('data-click'), arguments)
          scope.$broadcast('focus', '' + $(this).attr('data-click'));
        })
        
        // goto next slide
        scope.$watch('index', function(index) {
          $log.info('index changed', scope.height, element.find('.slider'))
          element.find('.slider').css({
            top: -index * scope.height
          });
        });

        scope.$watch('height', function(h) {
          $log.info('height changed', h)
           element.css({
            height: h
          })
        });
        

        
      }
    };
  })
  ;
