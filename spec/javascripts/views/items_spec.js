describe("ItemView", function() {
  var hubbubApp, appView;
  beforeEach(function(){
	  loadFixtures("item-template.html", "dialog-template.html");
    this.server = sinon.fakeServer.create();

    hubbubApp = HubbubApp();
    appView = new hubbubApp.AppView();

    hubbubApp.Items.add(new hubbubApp.Item({"description": "test"}));
  });
  afterEach(function() {
    this.server.restore();
  });

  describe("Instantiation", function() {
    
      it("should create a list element", function() {
            this.server.respondWith("GET", "/items",
                      [200, {"Content-Type": "application/json"},
                      '{"description":"Test","details":"Test Desc","id":25}']);
            this.server.respond();      
            
            expect(hubbubApp.Items.models[0].attributes.description).toEqual("Test");
      });
  });
});

