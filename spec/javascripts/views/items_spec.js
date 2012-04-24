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
  
  // describe("onHover", function(){
  //   it("Should show and hide the hover menu", function(){
  //     console.log($(this.view.el));
  //     console.log($("#jasmine-fixtures"));
  //     this.an_item = $("li");
  //     console.log($(".item"));
  //     $(".item_hover", this.view.el).css("display", 'block'); 
  //     // console.log($(".item_hover", this.view.el));
  //     // $("body").append($(".item_hover", this.view.el));    
  //     // console.log($("body")); 
  //     // $(".item", this.view.el).trigger("mouseover");      
  //     // console.log($(this.view.el));
  //     // console.log($(".item_hover").is(':visible'));
  //     // expect($('<div style="display:block" class="item_hover">testing</div>')).toBeVisible();
  //     // expect($('<div style="display:block" class="item_hover">testing</div>').is(':visible')).toBe(true);
  //     // expect($(".item_hover", this.view.el).is(':visible')).toBe(true);      
  //     // expect($(".item_hover", this.view.el)).toBeVisible();
  //     expect($(".item_hover", this.view.el)).toHaveAttr("style", "display: block; ");
  // 
  //     // this.view.$('.item').trigger('mouseout');
  //     // expect($('<div style="display:none" class="item_hover">testing</div>')).toBeHidden();
  //   });
  // 
  //   // it("Should display a hover menu on hover", function(){
  //   //   this.view.$('.item').trigger('mouseover');
  //   //   console.log(this.view.$('.item').trigger('mouseover'));
  //   //   expect(this.view.$('.item_hover')).toBeVisible();
  //   // });
  //   // 
  //   // it("Should hide the hover menu on mouseout", function(){
  //   //   this.view.$('.item').trigger('mouseover');
  //   //   this.view.$('.item').trigger('mouseout');
  //   //   expect(this.view.$('.item_hover')).toBeHidden();
  //   // });
  //   
  // });
});

