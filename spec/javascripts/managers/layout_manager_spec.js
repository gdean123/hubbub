describe("Layout Manager", function() {

  var hubbubApp;
  beforeEach(function(){
    loadFixtures("_main-template.html");
    hubbubApp = HubbubApp();
	  this.item = new hubbubApp.Item({
      "description": "test",
      "parent_id": null,
      "id": 23
    });

	  this.item.url = "/";
  });

  it("should create graph nodes to represent new items", function() {
    hubbubApp.Items.add(this.item);
    expect(hubbubApp.GraphNodes.length).toEqual(1);
  });
});
