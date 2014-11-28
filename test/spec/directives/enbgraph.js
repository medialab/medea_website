'use strict';

describe('Directive: enbgraph', function () {

  // load the directive's module
  beforeEach(module('driveoutApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<enbgraph></enbgraph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the enbgraph directive');
  }));
});
