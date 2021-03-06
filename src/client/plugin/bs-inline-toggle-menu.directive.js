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
      templateUrl: 'inline-toggle-menu/inline-toggle-menu.html', // build
      /*templateUrl: 'plugin/inline-toggle-menu.html',*/ // serve-dev
      scope: {
        menuItems: '=ngModel'
      },
      /* @ngInject */
      controller: function($scope) {
        $scope.toggleMenuClick = function(ngClick) {
          // seperate the ngClick parts into the ctrl prefix, method, and params
          var clickParts = ngClick.split('.');
          var prefix;
          var methodParts;

          if (clickParts.length === 1) {
            prefix = null;
            methodParts = clickParts[0].split('(');
          }else {
            prefix = clickParts[0];
            methodParts = clickParts[1].split('(');
          }

          var method = methodParts[0];
          var params = methodParts[1].split(')')[0].split(',');
          var ctrl = (prefix) ? $scope.$parent[prefix] : $scope.$parent;
          // pass up the call to the controller
          //console.log(ctrl + '[' + method + '].apply(' + ctrl + ', ' + params + ')');
          ctrl[method].apply(ctrl, params);
        };
      },
      link: link
    };

    return directive;
    ////////////////////

    function link($scope, element, attrs) {
      $scope.$on('$destroy', cleanUp);
      $scope.$watch('menuItems', activate);
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
