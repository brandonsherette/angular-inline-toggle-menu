/* jshint -W117, -W030 */
describe('bsInlineToggleMenu', function() {
  var directiveEl;
  var scope;

  beforeEach(function() {
    bard.appModule('inlineToggleMenu');
    bard.inject(this, '$compile', '$rootScope', '$controller');
  });

  beforeEach(function() {
    scope = $rootScope.$new();
    scope.menuItems = getMockMenuItems();
    scope.removeProduct = function() {};

    directiveEl = getCompiledElement();

    FixtureHelper.addFixture().addHtml(directiveEl.html());
    InlineToggleMenu.init();
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
    sinon.spy(scope, 'removeProduct');
    // trigger click
    $btnDelete.click();

    expect(scope.removeProduct).to.be.calledOnce;
    // restore removeProduct
    scope.removeProduct.restore();
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
          ngClick: 'removeProduct(' + product.id + ')'
        }
      ]
    };

    expect(menus.length).to.equal(3);
    // test adding items
    scope.menuItems.push(addMenuItem);
    // let the view know to digest update
    scope.$apply();

    menus = directiveEl.find('.inline-toggle-menu');
    expect(menus.length).to.equal(4);
  });

  it('should have correct number of menus after removing a menu item', function() {
    var menus = directiveEl.find('.inline-toggle-menu');

    expect(menus.length).to.equal(3);
    expect(InlineToggleMenu.getMenus().length).to.equal(3);
    // test removing items
    scope.menuItems.pop();
    // let the view know to digest update
    scope.$apply();

    menus = directiveEl.find('.inline-toggle-menu');
    expect(menus.length).to.equal(2);
  });

  ////////////

  function getCompiledElement() {
    var html =
      '<bs-inline-toggle-menu ng-model="menuItems">' +
      '</bs-inline-toggle-menu>';

    var element = angular.element(html);
    var compiledElement = $compile(element)(scope);

    scope.$digest();

    return compiledElement;
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
            ngClick: 'removeProduct(' + product.id + ')'
          }
        ]
      };

      menuItems.push(menuItem);
    });

    return menuItems;
  }
});
