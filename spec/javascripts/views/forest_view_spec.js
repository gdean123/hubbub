describe("ForestView", function() {

  beforeEach(function(){
    loadFixtures("_main-template.html");
    
    this.hubbubApp = HubbubApp();

    this.appView = new this.hubbubApp.AppView();
    this.item = new this.hubbubApp.Item({"description": "my description", "id": 23});
    this.hubbubApp.Items.add([this.item]);

    this.view = this.appView.forestView;
    this.view.render();
  });

  describe("render", function() {
    it("should render the description of each item", function() {
      expect(this.view.$("svg text tspan")).toHaveText('my description');
    });
    
    it("should render a line between a parent and a child", function() {
      this.child_item = new this.hubbubApp.Item({"description": "my description", "parent_id": this.item.get("id")});
      this.hubbubApp.Items.add([this.child_item]);
          
      expect(this.view.$("svg path")).toExist();
    });
    
  });

});

