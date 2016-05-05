(function() {
  'use strict';

  angular
    .module('app.product')
    .config(config);

  config.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
  /* @ngInject */
  function config($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('/', {
        url: '/',
        template: getRootTemplate()
      })
      .state('product', {
        url: '/product/:id',
        template: '<h1 class="text-center">Product Page</h1>'
      })
      .state('product-edit', {
        url: '/product/edit/:id',
        template: '<h1 class="text-center">Edit Product</h1>'
      })
      .state('product-delete', {
        url: '/product/delete/:id',
        template: '<h1 class="text-center">Delete Product</h1>'
      });

    /////////////////////////
    function getRootTemplate() {
      var tpl =
        '<div ' +
        'class="container-small" ' +
        'ng-controller="ProductAdminMenuController as vm">' +
        '<bs-inline-toggle-menu ng-model="vm.menuItems">' +
        '</bs-inline-toggle-menu>' +
        '</div>';

      return tpl;
    }
  }
})();
