/**
 * angular-inline-toggle-menu - Angular version of the 'inline-toggle-menu'.
 * @authors Brandon Sherette
 * @version v0.0.2
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
          var prefix = clickParts[0];
          var methodParts = clickParts[1].split('(');
          var method = methodParts[0];
          var params = methodParts[1].split(')')[0].split(',');
          var ctrl = ($scope.$parent[prefix]);
          // pass up the call to the controller
          ctrl[method].apply(ctrl, params);
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

angular.module("inlineToggleMenu").run(["$templateCache", function($templateCache) {$templateCache.put("inline-toggle-menu/inline-toggle-menu.html","<div ng-model=menuItems><ul class=nav><li class=inline-toggle-menu ng-repeat=\"menu in menuItems\"><span class=inline-toggle-menu-view><span class=inline-toggle-menu-contents><a href={{menu.url}} class=\"btn-default inline-toggle-menu-link\">{{menu.title}}</a></span> <span class=inline-toggle-menu-nav><span class=\"nav-item inline-toggle-menu-toggle\"><button type=button class=\"btn btn-primary\"><i class=\"toggle-icon fa fa-arrow-circle-left\"></i></button></span> <span class=nav-item ng-repeat=\"toggleMenu in menu.toggleMenuItems\"><a ng-if=toggleMenu.ngClick href={{toggleMenu.url}} ng-click=toggleMenuClick(toggleMenu.ngClick) class=\"btn {{toggleMenu.buttonCss}}\"><i class={{toggleMenu.iconCss}}></i></a> <a ng-if=!toggleMenu.ngClick href={{toggleMenu.url}} class=\"btn {{toggleMenu.buttonCss}}\"><i class={{toggleMenu.iconCss}}></i></a></span></span></span></li></ul></div>");}]);