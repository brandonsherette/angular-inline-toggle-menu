(function() {
  'use strict';

  angular
    .module('app.product')
    .controller('ProductAdminMenuController', ProductAdminMenuController);

  ProductAdminMenuController.$inject = ['$timeout', '$q'];
  /* @ngInject */
  function ProductAdminMenuController($timeout, $q) {
    var vm = this;
    var simulateServerResponse = false;

    vm.products = [];
    vm.menuItems = [];

    activate();
    //////////////

    function activate() {
      loadProducts().then(function(data) {
        vm.products = data;
        loadMenuItems();
      });
    }

    function loadProducts() {
      var deferred = $q.defer();

      var products = [
        {
          id: '2fba',
          name: 'Pencil'
        },
        {
          id: '1faa',
          name: 'CD Player'
        },
        {
          id: '5f31',
          name: 'Trash Can'
        }
      ];

      // simulate server response
      if (simulateServerResponse) {
        $timeout(function() {
          deferred.resolve(products);
        }, 500);
      }else {
        deferred.resolve(products);
      }

      return deferred.promise;
    }

    function loadMenuItems() {
      var menuItems = [];

      vm.products.forEach(function(product) {
        var menuItem = {
          title: product.name,
          url: '/product/' + product.id,
          toggleMenuItems: [
            {
              url: '/product/edit/' + product.id,
              buttonCss: 'btn-info',
              iconCss: 'fa fa-edit'
            },
            {
              url: '/product/delete/' + product.id,
              buttonCss: 'btn-danger',
              iconCss: 'fa fa-close'
            }
          ]
        };

        menuItems.push(menuItem);
      });

      vm.menuItems = menuItems;
    }
  }
})();
