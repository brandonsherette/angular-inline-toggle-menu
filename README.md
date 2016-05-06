#angular-inline-toggle-menu

This is an angular take on my inline toggle menu at <https://github.com/brandonsherette/inline-toggle-menu>.

It adds an angular directive to the module "inlineToggleMenu" and allows you 
to pre-build your inline toggle menus with an angular model.

#Updates

## v0.0.2 to v0.0.3
Added ngClick property to toggleMenuItem Objects. This allows you to add ng-click 
operation to any of your toggle menu items. I will call the $parent scope's method.

See Examples for more details on how to implement.

#Installation

##Bower

```bash
bower install https://github.com/brandonsherette/angular-inline-toggle-menu.git --save
```

##Add Dependency CSS
```html
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css">
<link rel="stylesheet" href="bower_components/inline-toggle-menu/dist/inline-toggle-menu.min.css">
```

##Add Scripts

```html
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="bower_components/inline-toggle-menu/dist/inline-toggle-menu.min.js"></script>
<script src="bower_components/angular-inline-toggle-menu/dist/inline-toggle-menu.js></script>
```

##Add Module to App

```js
angular.module('app', ['inlineToggleMenu']);
```
Where 'app' is the name of your main module (ex. ng-app="app").

##Inline Toggle Menu Directive
```html
<bs-inline-toggle-menu ng-model="menuItems"></bs-inline-toggle-menu>
```
Where menuItems is an array of all your inline toggle menu links.

##Menu Items

Menu items are an array of data for the angular-inline-toggle-menu directive 
to use to help build your html and should follow the following format.

```js
var menuItems = [
  {
    title: 'Title of first link',
    url: '#/view/fa', //The url for the main link, this is usually your view url
    toggleMenuItems: [ // array of all the menu items inside the toggle
      {
        url: '#/edit/fa', // the url for the 1st toggle menu item
        buttonCss: 'btn-info', // the button css class
        iconCss: 'fa fa-edit' // the css class for the icon
      },
      {
        url: '#', // the url for the 2nd toggle menu item
        buttonCss: 'btn-danger', // the button css class
        iconCss: 'fa fa-close', // css class for the icon
        ngClick: 'vm.removeItem(id)' // (OPTIONAL since v0.0.3) the method to call on ng-click it will target the parent scope in this case vm
      }
    ]
  },
  {
    title: 'Title for the second link',
    url: '#/view/f2',
    toggleMenuItems: [ // array of all the menu items inside the toggle
      {
        url: '#/edit/f2', // the url for the 1st toggle menu item
        buttonCss: 'btn-info', // the button css class
        iconCss: 'fa fa-edit' // the css class for the icon
      },
      {
        url: '#/delete/f2', // the url for the 2nd toggle menu item
        buttonCss: 'btn-danger', // the button css class
        iconCss: 'fa fa-close' // css class for the icon
      }
    ]
  }
];
```

##Directive Example

### js

```js
angular
  .module('app', ['inlineToggleMenu'])
  .controller('ProductAdminMenuController', function() {
    var vm = this;

    vm.menuItems = getProductMenuItems();
    vm.removeProduct = function(id) {
      console.log('TODO: Remove Product ' + id);
    };
  });

function getProductData() {
  var data = [
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

  return data;
}

function getProductMenuItems() {
  var data = getProductData();
  var menuItems = [];

  data.forEach(function(product) {
    var menuItem = {
      title: product.name,
      url: '#/product/' + product.id,
      toggleMenuItems: [
        {
          url: '#/product/edit/' + product.id,
          buttonCss: 'btn-info',
          iconCss: 'fa fa-edit'
        },
        {
          url: '#',
          buttonCss: 'btn-danger',
          iconCss: 'fa fa-close',
          ngClick: 'vm.removeProduct(' + product.id + ')'
        }
      ]
    };

    menuItems.push(menuItem);
  });

  return menuItems;
}
```

### html

```html
<div ng-controller="ProductAdminMenuController as vm">
  <bs-inline-toggle-menu ng-model="vm.menuItems"></bs-inline-toggle-menu>
</div>
```

#Examples

## Installed via Bower
Open **bower_components/angular-inline-toggle-menu/examples/example.bower.html.** in your web browser.

## Installed via Git
Open **examples/example.git.html** in your web browser.
