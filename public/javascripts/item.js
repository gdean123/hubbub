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
    url :'/items',
    
    initialize: function() {
      this.bind("reset", this.updateItemPositions);
      this.bind("add", this.updateItemPositions);
    },
    
    updateItemPositions: function() {
      // console.log(this);
      this.each(function(item) {
        // var x = Math.floor(Math.random()*this.$el.width() * 0.9),
        //     y = Math.floor(Math.random()*this.$el.height() * 0.7);
        
        // TODO - change out the hardcoded values
        var x = Math.floor(Math.random()*600),
            y = Math.floor(Math.random()*400);
        
        item.set({x: x});
        item.set({y: y});
      });
    }    
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
      this.options.showAddItemDialog(this.options.id);
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
      "mousemove": "refreshHoverMenu"
    },

    initialize: function() {
      this.paper = new Raphael('forest', this.$el.width(), this.$el.height());
      hubbubApp.Items.bind('all', this.render, this);
    },

    // Find the bounding box of the current hover menu
    getHoverBox: function() {
      if(this.currentGlyph) {
        var hoverWidth = $(".hover_menu").width();
        var hoverHeight = $(".hover_menu").height();
        var hoverLeft = $(".hover_menu").position().left;
        var hoverTop = $(".hover_menu").position().top;
        
        var hoverRight = hoverLeft + hoverWidth;
        var hoverBottom = hoverTop + hoverHeight;

        return {top:hoverTop,
                left:hoverLeft,
                right:hoverRight,
                bottom:hoverBottom};
      }
    },

    // Find the minimal bounding box that contains the both the hover menu
    // and the current item glyph
    getBoundingBox: function() {
      var hoverBox = this.getHoverBox();         // Hover menu bounding box
      var itemBox = this.currentGlyph.getBBox(); // Item's bounding box
      
      // TODO We need to address why this needs a +86 on the y value
      return {top:    Math.min(hoverBox.top,    itemBox.y+86), // y  = top
              left:   Math.min(hoverBox.left,   itemBox.x),    // x  = left
              right:  Math.max(hoverBox.right,  itemBox.x2),   // x2 = right
              bottom: Math.max(hoverBox.bottom, itemBox.y2)};  // y2 = bottom
    },

    getPaddedBoundingBox: function() {
      var boundingBox = this.getBoundingBox();
      var PADDING = 20;

      return {top:    boundingBox.top    - PADDING,
              left:   boundingBox.left   - PADDING,
              right:  boundingBox.right  + PADDING,
              bottom: boundingBox.bottom + PADDING};
    },

    // Check whether or not the given point is outside of the given rectangle
    isOutside: function(point, rectangle) {
      return point.x < rectangle.left  ||
             point.x > rectangle.right ||
             point.y < rectangle.top   ||
             point.y > rectangle.bottom;
    },

    refreshHoverMenu: function(e) {
      if(this.currentGlyph) {  
        var paddedBoundingBox = this.getPaddedBoundingBox();
        var cursor = {
          x: e.pageX-20,
          y: e.pageY-95
        };

        // If the cursor is outside of the bounding box, destroy the hover menu
        if (this.isOutside(cursor, paddedBoundingBox))
        {
          // Destroy the hover menu
          $(".hover_menu").parent().empty().remove();

          // There is no longer a current glyph
          this.currentGlyph = null;
        }
      }
    },
    
    // Find the parent of the given item
    getParent: function(item) {
      var output = null;
      hubbubApp.Items.each(function(currentItem) {
        if(item.get("parent_id") === currentItem.get("id")) {
          output = currentItem;
          console.log("Should never get here. currentItem.get(id) = " + currentItem.get("id"));
        } 
      });

      return output;      
    },
    
    addOne: function(item) {  
      var x = item.get("x"), y = item.get("y");    
      var glyph = this.paper.text(x, y, item.get("description"));
      glyph.attr("font-size", 32);

      var parentItem = this.getParent(item);
      
      // hook up if not null
      if(parentItem !== null && 
         parentItem.get("x") !== undefined && 
         parentItem.get("y") !== undefined && 
         x !== undefined && 
         y !== undefined) {
        this.paper.path("M"+parentItem.get("x")+" "+parentItem.get("y")+"L"+x+" "+y);        

        console.log("Drawing a line with parent " + parentItem.get("description"));
      }
      
      //Pointer to the context of the Forest View
      var that = this;   

      glyph.mouseover(function(){
        
        // Store the current glyph so that we can destroy the hover menu later
        that.currentGlyph = this;
        
        // Clean up any open hover menus
        try {          
          $(".hover_menu").parent().empty().remove();          
        } catch (err) {
          // don't complain
        }
        
        // Create a new hover menu
        // To compensate the size of the text box we added few more pixels
        var hoverMenuView = new hubbubApp.HoverMenuView({
	        showAddItemDialog: that.options.showAddItemDialog,
          top: y+100, left:x-25, id: item.get("id")  //Capture the Item id here
        });

        // Append it to the DOM
        //console.log($(that.el).last());
        $(that.el).last().append($(hoverMenuView.render().el));
      });
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

    triggerCreate: function() {
      
    },

    show: function(parentId) {
      this.parentId = parentId;
      $('.create').attr("data-parent-id", this.parentId);
                      
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
    create: function(ev) {
      this.parentId = $(ev.currentTarget).attr("data-parent-id");
      this.model = new hubbubApp.Item();
      
      this.model.set({
        id: hubbubApp.Utilities.generateGuid(),
        description: $("#description").val(),
        details: $("#details").val(),
        parent_id: this.parentId},
        {error: function(model, error)  {
          $('#description').qtip("show");
        }});
        
      if(this.model.isValid()) {
        hubbubApp.Items.add(this.model);
        this.model.save();
        console.log("New model id = " + this.model.get("id"));
        
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
      this.addItemView.show(null);
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

  hubbubApp.Utilities = {
    
    generateGuid: function() {
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
    
  }
  
  return hubbubApp;

});
