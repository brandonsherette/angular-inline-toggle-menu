(function() {
  'use strict';

  angular
    .module('inlineToggleMenu')
    .controller('InlineToggleMenuController', InlineToggleMenuController);

  InlineToggleMenuController.$inject = ['$scope'];
  /* @ngInject */
  function InlineToggleMenuController($scope) {
    var vm = this;

    $scope.on('$destroy', deactivate);

    activate();
    /////////////////

    function activate() {
      InlineToggleMenu.init();
    }

    function deactivate() {
      InlineToggleMenu.clearMenus();
    }
  }
})();
