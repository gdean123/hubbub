describe("ItemView", function() {
  var hubbubApp, appView;

  beforeEach(function(){
    loadFixtures("dialog-template.html", "item-template.html");

    hubbubApp = HubbubApp();
    appView = new hubbubApp.AppView();

    hubbubApp.Items.add(new hubbubApp.Item({"description": "test"}));
  });

  describe("Instantiation", function() {
    
      it("should create a list element", function() {
        //TypeError: Cannot read property 'models' of undefined
        expect(hubbubApp.Items.models[0].attributes.description).toEqual("test");
      });
  });
});