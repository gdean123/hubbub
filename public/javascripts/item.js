HubbubApp = (function(){
  var hubbubApp = {};

  /* ******************************************
  *  Item Model
  *
  *  Our basic **Item** model has `description`, and `details` attributes.
  * ******************************************/
  hubbubApp.Item = Backbone.Model.extend({

    validate: function(attrs) {
      if (!attrs.description || $.trim(attrs.description) === "") {
        return "Enter description";
      }
    }
  });

  /* ******************************************
  *  Item Collection
  *
  *  The collection of Items is backed by postrgresql.
  * ******************************************/
  hubbubApp.ItemList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: hubbubApp.Item,
    url :'/items'
  });

  // Create our collection of **Items**.
  hubbubApp.Items = new hubbubApp.ItemList();

  /* ******************************************
  *  Item View
  *
  *  The DOM element for an item...
  * ******************************************/
  hubbubApp.ItemView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').text()),

    // The DOM events specific to an item.
    events: {
      "click span.item-destroy"       : "clear"
    },

    // The ItemView listens for changes to its model, re-rendering.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
	},

    // Re-render the contents of the todo item.
    render: function() {

      // $(this.el).html(this.template(this.model.toJSON()));
      var tojson = this.model.toJSON();
      // console.log(tojson);
      $(this.el).html(this.template(tojson));
      this.setText();
      // this.createHoverMenu();
	    return this;
	  },
    
    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the todo item.
    setText: function() {
      var description = this.model.get("description");
      var details = this.model.get("details");
      this.$('.description-text').text(description);
      this.$('.details-text').text(details);
    },
        
    // Remove this view from the DOM.
    remove: function() {
      $(this.el).remove();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }
  });

  /* ******************************************
  *  ForestView
  *
  *  The DOM element for an item...
  * ******************************************/
  hubbubApp.ForestView = Backbone.View.extend({

    el: '#items',

    // The DOM events specific to an item.
    events: {
    },

    initialize: function() {
      this.paper = new Raphael('items', 200, 500);

      hubbubApp.Items.bind('add',   this.addOne, this);
      hubbubApp.Items.bind('all', this.render, this);
    },
    
    addOne: function(item) {
      this.paper.text(50, 50, item.get("description"));
    },
    
    render: function() {
      this.paper.clear();
      hubbubApp.Items.each(this.addOne, this);
    }
  });

  /* ******************************************
  *  Dialog to create a new item
  * ******************************************/
  hubbubApp.AddItemView = Backbone.View.extend({

    el: $("#dialog").parent(),

    events: {
      "keypress #description": "checkText",
      "keypress #details": "checkText",
      "click .create":  "create",
      "click .cancel":  "cancel"
    },

    initialize: function() {
      $("#dialog").dialog({ autoOpen: false });
    },

    // check to see if there is anything in the text field
    checkText: function() {
      $('#description').qtip("hide");
      $('#details').qtip("hide");
    },

    show: function() {
      $("#description").val("");
      $("#details").val("");
      $("#dialog").dialog("open");
    },

    // Do nothing, and jquery will close the dialog box
    cancel: function() {
      $("#dialog").dialog("close");
      $('#description').qtip("hide");
      $('#details').qtip("hide");
    },

    // Save the new item and jquery will close the dialog box
    create: function() {
      this.model = new hubbubApp.Item();
      this.model.set(
          {description: $("#description").val(), details: $("#details").val()},
          {error: function(model, error)  {
            $('#description').qtip("show");
          }});
      if(this.model.isValid()) {
        hubbubApp.Items.add(this.model);
        this.model.save();
        $('#description').qtip("hide");
        $("#dialog").dialog("close");
      }
    }
  });

  /* ******************************************
  *  The Application
  *
  *  Our overall **AppView** is the top-level piece of UI.
  * ******************************************/
  hubbubApp.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#hubbub_app"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click #add_item_btn"             : "showAddItemDialog",
      "mouseover #item-list li .item"   : "showHover",
      "mouseout #item-list li .item"    : "hideHover",
      "click #item-list li .item .add_child" : "showAddItemDialog"
    },

    // At initialization we bind to the relevant events on the `Items`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *postgresql*.
    initialize: function() {
      this.description    = this.$("#description");
      this.details        = this.$("#details");
      
      this.addItemView = new hubbubApp.AddItemView();
      this.forestView = new hubbubApp.ForestView();

      // fetch() calls the "reset" on the Items collection
      hubbubApp.Items.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    showAddItemDialog: function() {
      this.addItemView.show();
    },
    
    showHover: function (ev) {
      var target = ev.currentTarget;
      var self = this;
      // console.log("in showHover");
      
      $(target).children(".item_hover").show();
    },
    
    hideHover: function (ev) {
      var target = ev.currentTarget;
      var self = this;
      // console.log();
      $(target).children(".item_hover").hide(); 
    },

    // If you hit return in the main input field, and there is text to save,
    // create new **Item** model persisting it to database.
    createOnEnter: function(e) {
      var description = this.description.val();
      var details     = this.details.val();
      if (!description || e.keyCode != 13) { return; }
      hubbubApp.Items.create({description: description, details: details});
      this.description.val('');
      this.details.val('');
    }
  });

  return hubbubApp;

});
