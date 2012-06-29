describe("ForestView", function() {

  beforeEach(function(){
    loadFixtures("_main-template.html");
    
    this.hubbubApp = HubbubApp();
    this.appView = new this.hubbubApp.AppView();
    this.item = new this.hubbubApp.Item({
      "description": "my description",
      "id": "4ff2a9c7-d32c-4bc4-94f4-6a6a6b54c91e"
    });

    this.hubbubApp.Items.add([this.item]);
    this.view = this.appView.forestView;
    this.view.render();
  });

  describe("render", function() {
    it("should render the description of each item", function() {
      expect(this.view.$("svg text tspan")).toHaveText('my description');
    });
    
    it("should render a line between a parent and a child", function() {
      this.child_item = new this.hubbubApp.Item({
        "description": "my description",
        "id": "f7eb7fbe-a250-45dd-8a3d-7d154512e340",
        "parent_id": this.item.get("id")
      });

      this.hubbubApp.Items.add([this.child_item]);
      expect(this.view.$("svg path")).toExist();
    });
    
  });

});

