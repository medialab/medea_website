'use strict';

describe('Directive: zeppelin', function () {

  // load the directive's module
  beforeEach(module('driveoutApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<zeppelin></zeppelin>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the zeppelin directive');
  }));
});
