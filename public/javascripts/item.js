// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Todo Model
  // ----------

  // Our basic **Item** model has `description`, and `details` attributes.
  window.Item = Backbone.Model.extend({

    // Default attributes for an item.
    defaults: function() {
    }

  });

  // Item Collection
  // ---------------

  // The collection of Items is backed by postrgresql.
  window.ItemList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: Item,
    localStorage: new Store("items"),
    url :'/items'

  });

  // Create our global collection of **Items**.
  window.Items = new ItemList();

  // Items View
  // --------------

  // The DOM element for an item...
  window.ItemView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "dblclick div.item-text"    : "edit",
      "click span.item-destroy"   : "clear",
      "keypress .item-input"      : "updateOnEnter"
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
      var text = this.model.get('text');
      this.$('.item-text').text(text);
      this.input = this.$('.item-input');
      this.input.bind('blur', _.bind(this.close, this)).val(text);
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      this.model.save({text: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) {
        this.close();
      }
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

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#hubbub_app"),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-item":  "createOnEnter",
      "click .item-clear a": "clearCompleted"
    },

    // At initialization we bind to the relevant events on the `Items`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
      this.input    = this.$("#new-item");

      Items.bind('add',   this.addOne, this);
      Items.bind('reset', this.addAll, this);
      Items.bind('all',   this.render, this);

      Items.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
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
    // create new **Item** model persisting it to *localStorage*.
    createOnEnter: function(e) {
      var text = this.input.val();
      if (!text || e.keyCode != 13) { return; }
      Items.create({text: text});
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(Items.done(), function(item){ item.destroy(); });
      return false;
    }
  });

  // Finally, we kick things off by creating the **App**.
  window.App = new AppView();

});
