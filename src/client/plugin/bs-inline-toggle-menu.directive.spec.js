/* jshint -W117, -W030 */
describe('bsInlineToggleMenu', function() {
  var directiveEl;
  var scope;

  beforeEach(function() {
    bard.appModule('inlineToggleMenu', 'app');
    bard.inject(this, '$compile', '$rootScope');
  });

  beforeEach(function() {
    scope = $rootScope.$new();
    scope.menuItems = getMockMenuItems();
    directiveEl = getCompiledElement();
    FixtureHelper.addFixture().addHtml(directiveEl);
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
  ////////////

  function getCompiledElement() {
    var element = angular.element(
      '<bs-inline-toggle-menu ng-model="menuItems"></bs-inline-toggle-menu>');
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

    return menuItems;
  }
});
