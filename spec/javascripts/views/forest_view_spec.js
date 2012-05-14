describe("ForestView", function() {

  beforeEach(function(){
    loadFixtures("_forest-template.html");
    
    this.hubbubApp = HubbubApp();
    
    // this.appView = this.hubbubApp.AppView();
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
  
  
  // describe("Create Item", function() {
  //   it("should create a new item", function() {
  //     var spy = sinon.spy(this.appView.showAddItemDialog);
  //     $("img.add_child").click();
  //     expect(spy.called).toBeTruthy();
  //   });
  // });
  
});

