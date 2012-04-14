describe("ItemView", function() {
  beforeEach(function(){
    var tmp = HubbubApp();
    this.items = HubbubApp.Items;
    this.items.add(new HubbubApp.Item({"description": "test"}));
  });

  describe("Instantiation", function() {
    
      it("should create a list element", function() {
        expect(this.items.models[0].attributes.description).toEqual("test");
      });

 });
});