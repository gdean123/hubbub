describe("ItemView", function() {
  var hubbubApp, appView;
  beforeEach(function(){
	  loadFixtures("item-template.html", "dialog-template.html");

    hubbubApp = HubbubApp();
    this.item = new hubbubApp.Item({"description": "test"})
    this.view = new hubbubApp.ItemView({model: this.item});
    this.view.render();
  });

  describe("Instantiation", function() {
    
      it("should create a list element", function() {        
            expect(this.view.el.nodeName).toEqual("LI");
      });
      
      it("should render a descripion", function() {  
            expect(this.view.el.innerHTML).toContain("test");
      });
            
  });
});
