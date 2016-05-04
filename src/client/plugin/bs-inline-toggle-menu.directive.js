(function() {
  'use strict';

  angular
    .module('inlineToggleMenu')
    .directive('bsInlineToggleMenu', bsInlineToggleMenu);

  /* @ngInject */
  function bsInlineToggleMenu() {
    var directive = {
      restrict: 'E',
      templateUrl: 'plugin/inline-toggle-menu.html'
    };

    return directive;
    ////////////////////

    function link(scope, element, attrs) {

    }
  }
})();
