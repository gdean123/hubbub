describe("ItemView", function() {
  beforeEach(function(){
    this.item = new Item({"description": "test"});
    // var tmp1 = new AppView();    
    var tmp = new ItemView({model: this.item});
    // this.items = window.Items;
    // this.items.add(new Item({"description": "test"}));
  });

  describe("Instantiation", function() {

      it("should create a list element", function() {
        // expect(this.items.models[0].attributes.description).toEqual("test");
      });

 });
});