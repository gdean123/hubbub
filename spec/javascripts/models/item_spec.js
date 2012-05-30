describe("Item", function() {
  var hubbubApp;
  beforeEach(function(){
    hubbubApp = HubbubApp();
	  this.item = new hubbubApp.Item({"description": "test", "parent_id": null, "id": 23});
	  this.item.url = "/";
  });

  it("should create a new item with valid attributes", function() {
    expect(this.item.get("description")).toEqual("test");
  });
  
  it("should not allow the description field to be empty", function() {
    this.item.set("description", "");
	  expect(this.item.get("description")).toEqual("test");
  });
  
  it("it should either belong to a parent or be a root", function() {
    console.log(this.item);
    expect(this.item.get("parent_id")).toBe(null);
        
    
    //     this.child_item = new hubbubApp.Item({"description": "child", "parent_id": this.item.get("id")});
    // this.child_item.url = "/";
    // 
    //     expect(this.child_item.get("parent_id")).toEqual(this.item.get("id"));
  });

});
