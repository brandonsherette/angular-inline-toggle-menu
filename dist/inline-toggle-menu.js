/**
 * angular-inline-toggle-menu - Angular version of the 'inline-toggle-menu'.
 * @authors Brandon Sherette
 * @version v0.1.1
 * @link 
 * @license MIT
 */
(function() {
  'use strict';

  angular.module('inlineToggleMenu', []);
})();

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

angular.module("inlineToggleMenu").run(["$templateCache", function($templateCache) {$templateCache.put("inline-toggle-menu/inline-toggle-menu.html","<div ng-model=menuItems><ul class=nav><li class=inline-toggle-menu ng-repeat=\"menu in menuItems\"><span class=inline-toggle-menu__view><a href={{menu.url}} class=\"btn btn-default inline-toggle-menu__link\">{{menu.title}}</a> <span class=inline-toggle-menu__nav><button type=button class=\"btn btn-primary inline-toggle-menu__toggle\"><i class=\"toggle-icon fa fa-arrow-circle-left\"></i></button> <span class=inline-toggle-menu__nav-group ng-repeat=\"toggleMenu in menu.toggleMenuItems\"><a ng-if=toggleMenu.ngClick href={{toggleMenu.url}} ng-click=toggleMenuClick(toggleMenu.ngClick) class=\"btn {{toggleMenu.buttonCss}}\"><i class={{toggleMenu.iconCss}}></i></a> <a ng-if=!toggleMenu.ngClick href={{toggleMenu.url}} class=\"btn {{toggleMenu.buttonCss}}\"><i class={{toggleMenu.iconCss}}></i></a></span></span></span></li></ul></div>");}]);