(function() {
  'use strict';

  angular
    .module('app.product')
    .controller('ProductAdminMenuController', ProductAdminMenuController);

  ProductAdminMenuController.$inject = ['$timeout', '$q', '$window'];
  /* @ngInject */
  function ProductAdminMenuController($timeout, $q, $window) {
    var vm = this;
    var simulateServerResponse = false;

    vm.products = [];
    vm.menuItems = [];
    vm.removeProduct = removeProduct;

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
              /*url: '/product/delete/' + product.id,*/
              url: '#',
              buttonCss: 'btn-danger',
              iconCss: 'fa fa-close',
              ngClick: 'vm.removeProduct(' + product.id + ')'
            }
          ]
        };

        menuItems.push(menuItem);
      });

      vm.menuItems = menuItems;
    }

    function removeProduct(id) {
      var product = findProduct(id);
      var productName;
      var msg;
      var response;

      if (!product) {
        throw new Error('Product Not Found!');
      }

      productName = product.name;
      msg = 'Are you sure you want to delete: ' + productName + '?';
      response = $window.confirm(msg);

      if (response === true) {
        // perform delete process here
        $window.alert('Successfully Deleted ' + productName);
      }else {
        $window.alert('Delete Canceled');
      }
    }

    function findProduct(id) {
      var products = vm.products;
      var product;

      for (var x = 0; x < products.length; x += 1) {
        product = products[x];

        if (product.id === id) {
          return product;
        }
      }

      return null;
    }
  }
})();
