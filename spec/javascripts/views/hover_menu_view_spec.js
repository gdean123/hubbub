describe("HoverMenuView", function() {

  beforeEach(function(){
    loadFixtures("_hover-template.html");

    this.hubbubApp = HubbubApp();
    this.view = new this.hubbubApp.HoverMenuView({top: 0, left: 0});
    this.view.render();
  });

  describe("Render", function() {
    it("should render the add item icon", function() {
      expect($(this.view.el)).toContain('img.add_child');
    });
  });
});

