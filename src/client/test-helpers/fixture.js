/* jshint -W117, -W030 */
(function($) {
  var FixtureHelper = {
    $fixture: null,
    addFixture: addFixture,
    addHtml: addHtml,
    buildFixtureHtml: buildFixtureHtml,
    find: find,
    fixtureHtmlId: 'unit-fixture',
    removeFixture: removeFixture
  };

  // expose fixture helper
  window.FixtureHelper = FixtureHelper;

  return FixtureHelper;
  ///////////////////////

  function addFixture() {
    // ignore adding fixture if it already exists
    if (this.$fixture) {
      return this;
    }

    // add the built fixture html to the body
    document.body.insertAdjacentHTML('afterbegin', this.buildFixtureHtml());
    // cache the fixture
    this.$fixture = $('#' + this.fixtureHtmlId);

    return this;
  }

  function addHtml(html) {
    if (!this.$fixture) {
      throw new Error('Fixture hasn\'t been added yet. Please use ' +
        'FixtureHelper.addFixture() before adding html to the fixture.');
    }

    this.$fixture.html(html);
  }

  function buildFixtureHtml() {
    var fixtureHtml =
      '<div id="' + this.fixtureHtmlId + '" style="' +
      'position:absolute;' +
      'top:-10000px;' +
      'left:-10000px;' +
      'width:1000px;' +
      'height:1000px;">' +
      '</div>';

    return fixtureHtml;
  }

  function find(selector) {
    return this.$fixture.find(selector);
  }

  function removeFixture() {
    this.$fixture.remove();
    this.$fixture = null;

    return this;
  }
})(jQuery);
