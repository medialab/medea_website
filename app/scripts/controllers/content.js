angular.module('driveoutApp')
  .controller('contentCtrl', function($window, $scope, $element, $attrs, $log) {
        $log.log('control', $scope.$parent.content.sections);
        var w = angular.element($window);

        $scope.index = 0;
        $scope.height = w.height() - 250;

        $scope.$watch('index', function(index) {
          if (typeof index === 'string')
            $scope.index = +index;

          $scope.steer(index);
        });

        $scope.next = function() {
          var _index = $scope.index + 1;
          $scope.index = Math.min(_index, $scope.$parent.content.sections.length -1);
        };

        // goto previous slide
        $scope.previous = function() {
          var _index = $scope.index - 1;
          $scope.index = Math.max(_index, 0);
        };

        /*
          Goto a specific slide. If the section directive names has the 'follow' prefix,
          we do not substitute the current section in playground, but
          we 'inject' preliminary params instead. This function handle the
          the section scrolling inside the slider as well.
        */
        $scope.steer = function(index){
          if (index >= 0 && index < $scope.content.sections.length) {
            if($scope.content.sections[$scope.index]){
              $scope.section = $scope.content.sections[$scope.index];
            }
          }
        };

        //   Once timed properly, this funciton resize the szeppelin working area
        //   (fixing the height porperty according to window height props)

        w.on('resize', function () {
          $scope.height = w.height() - 250;
          $scope.$apply()
        });

        $scope.steer(0);
      }
  );
