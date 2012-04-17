describe("item", function() {
  var hubbubApp;
  beforeEach(function(){
    hubbubApp = HubbubApp();
	this.item = new hubbubApp.Item({"description": "test"})
	this.item.url = "/";
  });

  it("should create a new item with valid attributes", function() {
    expect(this.item.get("description")).toEqual("test");
  });
  
  it("should not allow the description field to be empty", function() {
    this.item.set("description", "");
	expect(this.item.get("description")).toEqual("test");
  });

});
