'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:zeppelin
 * @description The directove of directives
 * # zeppelin
 */
angular.module('driveoutApp.directives.zeppelin', [])
  .filter('unsafe', function($sce) { return $sce.trustAsHtml; })
  .directive('zeppelin', function() {
    return {
      templateUrl: 'views/templates/zeppelin.html',
      scope:{
        sections: '=',
        index: '='
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        element.on('click', '[data-click]', function(e) {
          scope.$broadcast('focus', '' + $(this).attr('data-click'));
        })

        //Scroll spy for the narratives' text
        $('.slider').on('scroll', function(e){
          //Checks its the good slider that is triggered
          if (e.currentTarget.parentNode.parentNode.id === element[0].id) {
            //Checks if the scroll has been triggered by the user or automatically
            if (scope.$parent.getScrollFlag()) {
              scope.$parent.automatedScroll = false;
              return true;
            }

            //Remembers the scroll position
            if (this.data === undefined)
              this.data = {oldPosition: 0, newPosition: e.currentTarget.scrollTop}
            else {
              this.data.oldPosition = this.data.newPosition;
              this.data.newPosition = e.currentTarget.scrollTop;
            }

            //Determine the next index to match
            //(could be the one before or the one after)
            var currentIndex = scope.$parent.getCurrentIndex(),
                nextIndex = this.data.newPosition < this.data.oldPosition ?
                            currentIndex - 1:
                            currentIndex + 1,
                functionToCall;

            if (nextIndex > currentIndex)
              functionToCall = scope.$parent.next
            else
              functionToCall = scope.$parent.previous

            if (element.find('#chapter_' + nextIndex)[0] !== undefined) {
              var switchViz = false,
                  upDiff = 200,
                  downDiff = 400;
              if (nextIndex > currentIndex) {
                functionToCall = scope.$parent.next;
                switchViz = element.find('#chapter_' + nextIndex)[0].offsetTop <
                            this.scrollTop + downDiff;
              }
              else if (nextIndex < currentIndex){
                functionToCall = scope.$parent.previous;
                switchViz = element.find('#chapter_' + currentIndex)[0].offsetTop >
                            this.scrollTop + upDiff;
              }

              if(switchViz) {
                functionToCall(true);
                scope.$parent.$apply();
              }
            }
          }
        })

        /**
         * Note Handler
         */
        element.on('click', '[noteIndex]', function(e) {
          e.preventDefault();
          var noteNumber = + $(this).attr('noteIndex');
        });


        scope.$parent.$watch(function(scopeP) {
          return scopeP.height;
          }, function(h) {
           element.css({
            height: h
          })
        });
      }
    };
  })
  ;
