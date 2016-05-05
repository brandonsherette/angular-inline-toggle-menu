/* jshint -W117 */
(function() {
  'use strict';

  angular
    .module('inlineToggleMenu')
    .directive('bsInlineToggleMenu', bsInlineToggleMenu);

  bsInlineToggleMenu.$inject = ['$timeout'];
  /* @ngInject */
  function bsInlineToggleMenu($timeout) {
    var directive = {
      restrict: 'E',
      /*templateUrl: 'inline-toggle-menu/inline-toggle-menu.html',*/
      templateUrl: 'plugin/inline-toggle-menu.html',
      scope: {
        menuItems: '=ngModel'
      },
      controller: function($scope) {
        $scope.toggleMenuClick = function(ngClick) {
          // seperate the ngClick parts into the ctrl prefix, method, and params
          var clickParts = ngClick.split('.');
          var prefix = clickParts[0];
          var methodParts = clickParts[1].split('(');
          var method = methodParts[0];
          var params = methodParts[1].split(')')[0].split(',');
          var ctrl = ($scope.$parent[prefix]);

          // pass up the call to the controller
          ctrl[method].apply(this, params);
        };
      },
      link: link
    };

    return directive;
    ////////////////////

    function link($scope, element, attrs) {
      $scope.$on('$destroy', cleanUp);
      $scope.$watch('ngModel', activate);
    }

    function cleanUp() {
      InlineToggleMenu.clearMenus();
    }

    function activate() {
      // need to wait for dom to finish rendering
      $timeout(function() {
        InlineToggleMenu.init();
      }, 0, false);
    }
  }
})();
