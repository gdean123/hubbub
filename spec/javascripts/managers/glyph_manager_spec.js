describe("Glyph Manager", function() {

  var hubbubApp;
  beforeEach(function(){
    loadFixtures("_main-template.html");

    hubbubApp = HubbubApp();
	  this.item = new hubbubApp.Item({
      "description": "test",
      "parent_id": null,
      "id": "7749ffcb-789b-4147-91de-5e459658e5d7"
    });

	  this.item.url = "/";
  });

  it("should create a glyph node to represent new graph nodes", function() {
    hubbubApp.Items.add(this.item);               // Creates a new graph node
    expect(hubbubApp.GlyphNodes.length).toEqual(1);
  });

});
