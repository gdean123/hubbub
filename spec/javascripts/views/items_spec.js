describe("ItemView", function() {
  var hubbubApp, appView;
  beforeEach(function(){
	loadFixtures("_item-template.html", "_dialog-template.html");

    hubbubApp = HubbubApp();
    this.item = new hubbubApp.Item({"description": "test"})
    this.view = new hubbubApp.ItemView({model: this.item});
    this.view.render();
  });

  describe("Instantiation", function() {
      it("should create a list element", function() {        
            expect(this.view.el.nodeName).toEqual("LI");
      });
      
      it("should render a description", function() {
            expect(this.view.el.innerHTML).toContain("test");
      });
            
  });

//  describe("onHover", function(){
//    it("Should show and hide the hover menu", function(){
//      $(".item", this.view.el).trigger("mouseover");
//      expect($(".item_hover", this.view.el)).toBeVisible();
//    });
//
//    it("Should hide the hover menu on mouseout", function(){
//      this.view.$('.item').trigger('mouseover');
//      this.view.$('.item').trigger('mouseout');
//      expect(this.view.$('.item_hover')).toBeHidden();
//    });
//
//  });
});

