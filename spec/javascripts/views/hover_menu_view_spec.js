describe("HoverMenuView", function() {

  beforeEach(function(){
    loadFixtures("_main-template.html", "_hover-template.html");

    this.hubbubApp = HubbubApp();

    this.appView = new this.hubbubApp.AppView();
    this.addItemView = this.appView.addItemView;
    this.hoverMenuView = new this.hubbubApp.HoverMenuView({
	  showAddItemDialog: this.addItemView.show,
	  top: 0,
	  left: 0
	});

    this.hoverMenuView.render();
  });

  describe("Render", function() {
    it("should render the add item icon", function() {
      expect($(this.hoverMenuView.el)).toContain('img.add_child');
    });
  });

  describe("Add item button", function() {
     it("should show add item dialog", function() {
       var showAddItemViewSpy = sinon.spy(this.addItemView.show);
       this.hoverMenuView.$("img.add_child").click();
       //this.hoverMenuView.addChild();
       expect(showAddItemViewSpy).toHaveBeenCalled();
     });
  });

});

