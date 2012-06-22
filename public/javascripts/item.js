HubbubApp = (function(){
  var hubbubApp = {};

  // Use Mustache syntax for templating
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  /* *********************************************************************** */
  /*  Item Model - the model for a single item.                              */
  /* *********************************************************************** */
  hubbubApp.Item = Backbone.Model.extend({

    initialize: function() {
      this.setItemPosition();
    },
    
    validate: function(attrs) {
      if (!attrs.description || $.trim(attrs.description) === "") {
        return "Enter description";
      }
    },
    
    setItemPosition: function() {
      this.set({
        x: Math.floor(Math.random()*600),
        y: Math.floor(Math.random()*342)}, 
        {silent: true});
    }
  });

  /* *********************************************************************** */
  /*  Item Collection -- the complete set of items.                          */
  /* *********************************************************************** */
  hubbubApp.ItemList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: hubbubApp.Item,
    url :'/items'    
  });

  // Create our collection of **Items**.
  hubbubApp.Items = new hubbubApp.ItemList();

  /* *********************************************************************** */
  /*  Hover Menu View -- the menu shown when hovering over an item.          */
  /* *********************************************************************** */
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

  /* *********************************************************************** */
  /*  Forest View -- the entire canvas area created by Raphael.              */
  /* *********************************************************************** */
  hubbubApp.ForestView = Backbone.View.extend({

    el: '#forest',

    // The DOM events specific to an item.
    events: {
      "mousemove": "refreshHoverMenu"
    },

    initialize: function() {
      this.paper = new Raphael('forest', this.$el.width(), this.$el.height());
      hubbubApp.Items.bind('all', this.render, this);
      this.particleSystem = arbor.ParticleSystem();
      this.particleSystem.renderer = this;
    },
    
    init:this.render, // Call the render function when the view is initialized
    redraw:this.render, // Call the render funtion when redraw occurs
    
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
        } 
      });

      return output;      
    },
    
    renderItem: function(item) {  
      var x = item.get("x"), y = item.get("y");
      this.particleSystem.addNode(item.get("id"), {'x':x, 'y':y});
      var parentItem = this.getParent(item);

      // hook up if not null
      if(parentItem !== null) {
        // Draw a line from the parent to the child
        var line = this.paper.path(
          "M"+parentItem.get("x")+" "+parentItem.get("y")+"L"+x+" "+y);
          line.attr("stroke-width", "2");
          line.attr("stroke", "#626CF7");
        line.toBack();  
      }

      // Set the text
      var glyph = this.paper.text(x, y, item.get("description"));
      glyph.attr("font-size", 32);

      var glyphWidth = glyph.getBBox().width + 15;
      var glyphHeight = glyph.getBBox().height + 15;

      // Create rectangle for visual effect
      var rect = this.paper.rect(x-(glyphWidth/2), y-(glyphHeight/2), glyphWidth, glyphHeight);
      rect.attr("r", "10");
      rect.attr("stroke-width", "2");
      rect.attr("stroke", "#626CF7");
      rect.attr("fill", "#CDD1FC");
      
      glyph.toFront();
      
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
        $(that.el).last().append($(hoverMenuView.render().el));
      });
    },
    
    render: function() {
      this.paper.clear();
      hubbubApp.Items.each(this.renderItem, this);
    }
  });

  /* *********************************************************************** */
  /*  Add Item View -- the dialog to create an item.                         */
  /* *********************************************************************** */
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

    // Check to see if there is anything in the text field
    checkText: function() {
      $('#description').qtip("hide");
      $('#details').qtip("hide");
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

        $('#description').qtip("hide");
        $("#dialog").dialog("close");
      }
    }
  });

  /* *********************************************************************** */
  /*  App View -- the top-level piece of the user interface.                 */
  /* *********************************************************************** */
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
    // loading any preexisting items that might be saved in *postgresql*.
    initialize: function() {
      this.description    = this.$("#description");
      this.details        = this.$("#details");
      
      // Create all subviews
      this.addItemView = new hubbubApp.AddItemView();
      this.forestView =
        new hubbubApp.ForestView({showAddItemDialog: this.addItemView.show});

      // fetch() calls the "reset" on the Items collection
      hubbubApp.Items.fetch();
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    showAddItemDialog: function() {
      this.addItemView.show(null);
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

  /* *********************************************************************** */
  /*  Utilities -- a collection of application-wide utility functions.       */
  /* *********************************************************************** */
  hubbubApp.Utilities = {

    // Generate a new globally unique identifier
    generateGuid: function() {
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
  };
  
  return hubbubApp;

});
