/* jshint -W117, -W030 */
describe('bsInlineToggleMenu', function() {
  var directiveEl;
  var scope;
  var mockController;

  beforeEach(function() {
    bard.appModule('inlineToggleMenu', function($controllerProvider) {
      $controllerProvider.register('MockController', getMockController());
    });
    bard.inject(this, '$compile', '$rootScope', '$controller');
  });

  beforeEach(function() {
    scope = $rootScope.$new();
    scope.menuItems = getMockMenuItems();

    directiveEl = getCompiledElement();

    FixtureHelper.addFixture().addHtml(directiveEl.html());
    InlineToggleMenu.init();
    // get the controller used by the directive
    mockController = directiveEl.controller();
  });

  afterEach(function() {
    InlineToggleMenu.clearMenus();
    FixtureHelper.removeFixture();
  });

  it('should exist', function() {
    expect(directiveEl).to.be.defined;
  });

  it('should get the correct number of menus', function() {
    expect(InlineToggleMenu.getMenus().length).to.equal(3);
  });

  it('should destroy properly', function() {
    expect(InlineToggleMenu.getMenus().length).to.equal(3);

    scope.$broadcast('$destroy');
    scope.$digest();
    expect(InlineToggleMenu.getMenus().length).to.equal(0);
  });

  it('should have set ng-click if available', function() {
    var $btnDelete = directiveEl.find('.btn-danger');

    expect($btnDelete).to.be.defined;
    expect($btnDelete.attr('ng-click')).to.be.defined;
  });

  it('should call ng-click method if clicked', function() {
    var $btnDelete = directiveEl.find('.btn-danger').get(0);
    // spy to make sure remove product is being called properly
    sinon.spy(mockController, 'removeProduct');
    // trigger click
    $btnDelete.click();

    expect(mockController.removeProduct).to.be.calledOnce;
    // restore removeProduct
    mockController.removeProduct.restore();
  });

  it('should not have an ng-click attr if not available', function() {
    // the mock edit button should not have ng-click
    var $btnEdit = directiveEl.find('.btn-info');

    expect($btnEdit).to.be.defined;
    expect($btnEdit.attr('ng-click')).to.not.be.defined;
  });

  it('should have correct number of menus after adding a menu item', function() {
    var menus = directiveEl.find('.inline-toggle-menu');
    var product = {
      id: '2aa1',
      name: 'Car Oil'
    };
    var addMenuItem = {
      title: product.name,
      url: '#' + product.id,
      toggleMenuItems: [
        {
          url: '#' + product.id,
          buttonCss: 'btn-info',
          iconCss: 'fa fa-edit'
        },
        {
          url: '#' + product.id,
          buttonCss: 'btn-danger',
          iconCss: 'fa fa-close',
          ngClick: 'vm.removeProduct(' + product.id + ')'
        }
      ]
    };

    expect(menus.length).to.equal(3);
    expect(InlineToggleMenu.getMenus().length).to.equal(3);
    // test adding items
    mockController.addMenuItem(addMenuItem);
    scope.menuItems = mockController.menuItems;
    // let the view know to digest update
    scope.$digest();

    console.log(scope);
    console.log(directiveEl.scope());

    menus = directiveEl.find('.inline-toggle-menu');
    expect(menus.length).to.equal(4);
    expect(InlineToggleMenu.getMenus().length).to.equal(4);
  });

  it('should have correct number of menus after removing a menu item', function() {
    var menus = directiveEl.find('.inline-toggle-menu');

    expect(menus.length).to.equal(3);
    expect(InlineToggleMenu.getMenus().length).to.equal(3);
    // test adding items
    mockController.removeLastMenuItem();
    scope.menuItems = mockController.menuItems;
    // let the view know to digest update
    scope.$digest();

    menus = directiveEl.find('.inline-toggle-menu');
    expect(menus.length).to.equal(2);
    expect(InlineToggleMenu.getMenus().length).to.equal(2);
  });

  ////////////

  function getCompiledElement() {
    var html =
      '<div ng-controller="MockController as vm">' +
      '<bs-inline-toggle-menu ng-model="vm.menuItems">' +
      '</bs-inline-toggle-menu>' +
      '</div>';

    var element = angular.element(html);
    var compiledElement = $compile(element)(scope);

    scope.$digest();

    return compiledElement;
  }

  function getMockController() {
    return function() {
      var vm = this;

      vm.menuItems = getMockMenuItems();
      vm.removeProduct = function(id) {
        //console.log('Removing Product: ' + id);
      };
      vm.removeLastMenuItem = function() {
        vm.menuItems.pop();
      };
      vm.addMenuItem = function(menu) {
        vm.menuItems.push(menu);
      };
    };
  }

  function getMockData() {
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

  function getMockMenuItems() {
    var data = getMockData();
    var menuItems = [];

    data.forEach(function(product) {
      var menuItem = {
        title: product.name,
        url: '#' + product.id,
        toggleMenuItems: [
          {
            url: '#' + product.id,
            buttonCss: 'btn-info',
            iconCss: 'fa fa-edit'
          },
          {
            url: '#' + product.id,
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
});
