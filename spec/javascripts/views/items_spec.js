describe("ItemView", function() {
  beforeEach(function(){
    console.log(window.Items);
    this.items = window.Items;
    this.items.add(new Item({"description": "test"}));
  });

  describe("Instantiation", function() {

      it("should create a list element", function() {
        console.log(this.items);
        expect(this.items.models[0].attributes.description).toEqual("test");
      });

 });
});