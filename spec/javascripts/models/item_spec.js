describe("item", function() {
  var hubbubApp, appView;
  beforeEach(function(){
    hubbubApp = HubbubApp();
    // appView = new hubbubApp.AppView();
    
    hubbubApp.Items.add(new hubbubApp.Item({"description": "a todo item"}));    
  });

  it("should create a new item", function() {
    expect(hubbubApp.Items.first().get("description")).toEqual("a todo item");
  });
  
  describe("required", function() {

      // it("should not accept a blank field in description", function() {
      //   var eventSpy = sinon.spy();
      //   this.item.bind("error", eventSpy);
      //   this.item.save({"description": ""});
      //   expect(this.eventSpy.calledOnce).toBeTruthy();
      //   expect(this.eventSpy.calledWith(
      //     this.item, 
      //     "is required"
      //   )).toBeTruthy();
      // 
      // });
  });
     
});