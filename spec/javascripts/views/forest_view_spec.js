describe("ForestView", function() {

  beforeEach(function(){
    loadFixtures("_forest-template.html");

    this.hubbubApp = HubbubApp();
    this.item = new this.hubbubApp.Item({"description": "my description"});
    this.hubbubApp.Items.add([this.item]);

    this.view = new this.hubbubApp.ForestView();
    this.view.render();
  });

  describe("Render", function() {
    it("should render the description of each item", function() {
      expect(this.view.$("svg text tspan")).toHaveText('my description');
    });
  });
});

