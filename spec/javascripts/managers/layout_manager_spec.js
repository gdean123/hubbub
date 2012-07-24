describe("Layout Manager", function() {

  var hubbubApp;
  beforeEach(function(){
    loadFixtures("_main-template.html");

    hubbubApp = HubbubApp();
    this.appView = new hubbubApp.AppView();

	  this.item = new hubbubApp.Item({
      "description": "test",
      "parent_id": null,
      "id": "8c81abc9-2fab-493b-8e64-5ce64011f8c1"
    });

	  this.item.url = "/";
  });

  it("should create graph nodes to represent new items", function() {
    hubbubApp.Items.add(this.item);
    expect(hubbubApp.GraphNodes.length).toEqual(1);
  });

  it("should create graph edges to represent parent-child relationships", function() {
    this.childItem = new hubbubApp.Item({
      "id": "523c8a3b-d674-48ab-abc8-f8c7c30776aa",
      "description": "child",
      "parent_id": this.item.get("id")
    });

    hubbubApp.Items.add(this.item);
    hubbubApp.Items.add(this.childItem);

    expect(hubbubApp.GraphEdges.length).toEqual(1);
  });
});
