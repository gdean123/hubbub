describe("HoverMenuView", function() {

  beforeEach(function(){
    loadFixtures("_main-template.html", "_hover-template.html");
    this.showAddItemDialogSpy = sinon.spy();

    this.hubbubApp = HubbubApp();

    this.appView = new this.hubbubApp.AppView();
    this.hoverMenuView = new this.hubbubApp.HoverMenuView({
      showAddItemDialog: this.showAddItemDialogSpy,
      top: 0,
      left: 0
    });

    this.hoverMenuView.render();
  });

  describe("render", function() {
    it("should render the add item icon", function() {
      expect($(this.hoverMenuView.el)).toContain('img.add_child');
    });
  });

  describe("add item button", function() {
     it("should show the add item dialog", function() {
       this.hoverMenuView.$("img.add_child").click();
       expect(this.showAddItemDialogSpy).toHaveBeenCalled();
     });
  });

});

