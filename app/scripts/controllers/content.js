angular.module('driveoutApp')
  .controller('contentCtrl', function($window, $scope, $element, $attrs) {
        var w = angular.element($window);

        $scope.index = 0;
        $scope.height = w.height() - 250;

        $scope.automatedScroll = false;

        $scope.$watch('index', function(index) {
          if (typeof index === 'string')
            $scope.index = +index;

          $scope.steer(index);
        });

        $scope.getScrollFlag = function() {
          return $scope.automatedScroll;
        }

        $scope.bringTextTo = function(index) {
          $scope.automatedScroll = true;
          var element = $element,
              sliderComponent = element.find('.slider');
          if (element.find('#chapter_' + index)[0] !== undefined) {
            sliderComponent.scrollTop(
              element.find('#chapter_' + index)[0].offsetTop -
              sliderComponent[0].offsetTop)
          }
        }

        $scope.next = function(fromScroll) {
          var _index = $scope.index + 1;
          $scope.index = Math.min(_index, $scope.$parent.content.sections.length -1);
          if (!fromScroll)
            $scope.bringTextTo($scope.index);
        };

        // goto previous slide
        $scope.previous = function(fromScroll) {
          var _index = $scope.index - 1;
          $scope.index = Math.max(_index, 0);
          if (!fromScroll)
            $scope.bringTextTo($scope.index);
        };

        $scope.getCurrentIndex = function() {
          return $scope.index;
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
        });

        $scope.steer(0);
      }
  );
