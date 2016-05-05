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
      templateUrl: 'inline-toggle-menu/inline-toggle-menu.html',
      scope: {
        ngModel: '=',
        menuId: '@'
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

angular.module("inlineToggleMenu").run(["$templateCache", function($templateCache) {$templateCache.put("inline-toggle-menu/inline-toggle-menu.html","<div ng-model=ngModel><ul class=nav><li class=inline-toggle-menu ng-repeat=\"menu in ngModel\"><span class=inline-toggle-menu-view><span class=inline-toggle-menu-contents><a href={{menu.url}} class=\"btn-default inline-toggle-menu-link\">{{menu.title}}</a></span> <span class=inline-toggle-menu-nav><span class=\"nav-item inline-toggle-menu-toggle\"><button type=button class=\"btn btn-primary\"><i class=\"toggle-icon fa fa-arrow-circle-left\"></i></button></span> <span class=nav-item ng-repeat=\"toggleMenu in menu.toggleMenuItems\"><a href={{toggleMenu.url}} class=\"btn {{toggleMenu.buttonCss}}\"><i class={{toggleMenu.iconCss}}></i></a></span></span></span></li></ul></div>");}]);