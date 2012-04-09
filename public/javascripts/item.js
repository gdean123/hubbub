// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  /* ******************************************
  *  Item Model
  *
  *  Our basic **Item** model has `description`, and `details` attributes.
  * ******************************************/
  window.Item = Backbone.Model.extend({

  validate: function(attrs) {
    if (!attrs.description || $.trim(attrs.description) === "") {
      return "Enter description";
    }
  }

    // Default attributes for an item.
    // defaults: function() {
    // }

  });


  /* ******************************************
  *  Item Collection
  *
  *  The collection of Items is backed by postrgresql.
  * ******************************************/
  window.ItemList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: Item,
    // localStorage: new Store("items"),
    
    url :'/items'

  });




  // Create our global collection of **Items**.
  window.Items = new ItemList();




  /* ******************************************
  *  Items View
  *
  *  The DOM element for an item...
  * ******************************************/
  window.ItemView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click span.item-destroy"       : "clear"
      //"keypress .description-input"   : "updateOnEnter",
      //"keypress .details-input"       : "updateOnEnter",
      //"submit #submit"                : "updateAllOnEnter"
    },

    // The ItemView listens for changes to its model, re-rendering.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the todo item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setText();
      return this;
    },

    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the todo item.
    setText: function() {
      var description = this.model.get("description");
      var details = this.model.get("details");
      this.$('#description-text').text(description);
      this.$('#details-text').text(details);
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
  *  Dialog to create a new item
  * ******************************************/
  window.AddItemView = Backbone.View.extend({

    el: $("#dialog").parent(),

    events: {
      "keypress #description": "checkText",
      "keypress #details": "checkText",
      "click .create":  "create",
      "click .cancel":  "cancel"
    },
    
    initialize: function() {
/*      $("description").qtip({
        content: 'Enter description',
        position: {
          corner: {
            target: 'bottomLeft',
            tooltip: 'bottomLeft'
          }
        }
      });*/
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
      this.model = new Item();
      this.model.set(
          {description: $("#description").val(), details: $("#details").val()},
          {error: function(model, error)  {
            $('#description').qtip("show");
          }});
      if(this.model.isValid()) {
        Items.add(this.model);
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
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#hubbub_app"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click #add_item_btn":  "showAddItemDialog"
    },

    // At initialization we bind to the relevant events on the `Items`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *postgresql*.
    initialize: function() {
      this.description    = this.$("#description");
      this.details        = this.$("#details");

      Items.bind('add',   this.addOne, this);
      Items.bind('reset', this.addAll, this);
      Items.bind('all',   this.render, this);

      this.addItemView = new AddItemView();

      // fetch() calls the "reset" on the Items collection
      Items.fetch();
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

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(item) {
      var view = new ItemView({model: item});
      $("#item-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Items.each(this.addOne);
    },

    // If you hit return in the main input field, and there is text to save,
    // create new **Item** model persisting it to database.
    createOnEnter: function(e) {
      var description = this.description.val();
      var details     = this.details.val();
      if (!description || e.keyCode != 13) { return; }
      Items.create({description: description, details: details});
      this.description.val('');
      this.details.val('');
    }
    
    // handle submitting the form 
//    onSubmit: function(e) {
//    }

  });

  // Finally, we kick things off by creating the **App**.
  window.App = new AppView();

});
