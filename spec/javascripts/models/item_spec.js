describe("Item", function() {
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

  it("should create a new item with valid attributes", function() {
    expect(this.item.get("description")).toEqual("test");
  });
  
  it("should not allow the description field to be empty", function() {
    this.item.set("description", "");
	  expect(this.item.get("description")).toEqual("test");
  });
  
  describe("child", function(){
    it("should belong to a parent", function() {      
      this.child_item = new hubbubApp.Item({
        "description": "child",
        "parent_id": this.item.get("id")
      });

      this.child_item.url = "/";
      expect(this.child_item.get("parent_id")).toBe(23);
    });
  });

});
