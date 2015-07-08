angular.module('driveoutApp.content', ['ui.bootstrap'])
  .controller('contentCtrl', function($window, $scope, $element, $attrs) {
       var w = angular.element($window);
        $scope.index = 0;
        $scope.height = w.height() - 265;

        $scope.automatedScroll = false;

        $scope.$watch('index', function(index) {
          if (typeof index === 'string')
            $scope.index = +index;

          $scope.steer(index);
          // Dispatch event to update the view according to the index
          // Used for the zoom on the graph part of the UNFCCC view
          $scope.$broadcast('updateView', index);
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


        $scope.steer = function(index){
          if (index >= 0 && index < $scope.$parent.content.sections.length) {
            if($scope.$parent.content.sections[$scope.index]){
              $scope.section = $scope.$parent.content.sections[$scope.index];
            }
          }
        };

        //   Once timed properly, this funciton resize the szeppelin working area
        //   (fixing the height porperty according to window height props)
        w.on('resize', function () {
          $scope.height = w.height() - 265;
          $scope.$apply();
        });


        $scope.steer(0);
      }
  );
