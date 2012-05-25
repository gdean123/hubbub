HubbubApp = (function(){
  var hubbubApp = {};

  // Use Mustache syntax for templating
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

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
  *  HoverMenuView
  *
  *  The DOM element for an item's hover menu.
  * ******************************************/
  hubbubApp.HoverMenuView = Backbone.View.extend({

    // Cache the template function.
    template: _.template($('#hover-template').text()),

    // The DOM events specific to an item.
    events: {
        "click .add_child":  "addChild"
    },

    initialize: function() {
    },

    addChild: function() {
      this.options.showAddItemDialog();
    },

    render: function() {
      $(this.el).html(this.template({
        top: this.options.top,
        left: this.options.left
      }));
      return this;
    }
  });

  /* ******************************************
  *  ForestView
  *
  *  The DOM element for an item...
  * ******************************************/
  hubbubApp.ForestView = Backbone.View.extend({

    el: '#forest',

    // The DOM events specific to an item.
    events: {
      "mousemove": "checkHoverMenu"
    },

    initialize: function() {
      this.paper = new Raphael('forest', this.$el.width(), this.$el.height());
      hubbubApp.Items.bind('all', this.render, this);
    },
    
    getHoverBox: function() {
      if(this.currentGlyph) {
        var hoverWidth = $(".hover_menu").width();
        var hoverHeight = $(".hover_menu").height();
        var hoverLeft = $(".hover_menu").position().left;
        var hoverTop = $(".hover_menu").position().top;
        
        var hoverRight = hoverLeft + hoverWidth;
        var hoverBottom = hoverTop + hoverHeight;
        
        
        return {top:hoverTop, left:hoverLeft, right:hoverRight, bottom:hoverBottom}

        
        // console.log($(".hover_menu").position().left);
        // console.log(this.currentGlyph.getBBox()); 
      }
    },
    
    getBoundingBox: function() {
      var hoverBox = this.getHoverBox();
      var itemBox = this.currentGlyph.getBBox();
      
      // TODO We need to address why this needs a +86 on the y value
      return {top: Math.min(hoverBox.top, itemBox.y+86), 
              left: Math.min(hoverBox.left, itemBox.x), 
              right: Math.max(hoverBox.right, itemBox.x2), 
              bottom: Math.max(hoverBox.bottom, itemBox.y2)}
      
    },
    
    checkHoverMenu: function(e) {
      if(this.currentGlyph) {
        var bBox = this.getBoundingBox();
        var pageCoords = "( " + (e.pageX-20) + ", " + (e.pageY-95) + " )";            
        // TODO - Write an if statement that checks to see if our page coords 
        // are outside of the bounding box, destroy the hover menu
      }
    },
    
    addOne: function(item) {
      var x = Math.floor(Math.random()*this.$el.width() * 0.9),
          y = Math.floor(Math.random()*this.$el.height() * 0.7);

      var glyph = this.paper.text(x, y, item.get("description"));
      glyph.attr("font-size", 32);

      var that = this;
      glyph.mouseover(function(){
        // Create a new hover menu
        //to compensate the size of the text box we added few more pixels
        var hoverMenuView = new hubbubApp.HoverMenuView({
	      showAddItemDialog: that.options.showAddItemDialog,
          top: y+100, left:x-25
        });

        // store glyph for future reference
        that.currentGlyph = this; 

        // Append it to the DOM
        //console.log($(that.el).last());
        $(that.el).last().append($(hoverMenuView.render().el));
      });

//      glyph.mouseout(function(){
//        $(".hover_menu").parent().empty().remove();
//      });

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
      "click #add_item_btn"             : "showAddItemDialog"
    },

    // At initialization we bind to the relevant events on the `Items`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *postgresql*.
    initialize: function() {
      this.description    = this.$("#description");
      this.details        = this.$("#details");
      
      // Create all subviews
      this.addItemView = new hubbubApp.AddItemView();
      this.forestView = new hubbubApp.ForestView({showAddItemDialog: this.addItemView.show});

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

    // To be deleted?
    showHover: function (ev) {
      var target = ev.currentTarget;
      var self = this;
      
      $(target).children(".hover_menu").show();
    },
    
    hideHover: function (ev) {
      var target = ev.currentTarget;
      var self = this;

      $(target).children(".hover_menu").hide(); 
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
