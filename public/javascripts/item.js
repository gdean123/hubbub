HubbubApp = (function(){
  var hubbubApp = {};

  // Use Mustache syntax for templating
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

  /*  --- Models ----------------------------------------------------------- */

  /* *********************************************************************** */
  /*  Item Model - the model for a single item.                              */
  /* *********************************************************************** */
  hubbubApp.Item = Backbone.Model.extend({

    initialize: function() {
      this.generateRandomPosition();
    },
    
    validate: function(attrs) {
      if (!attrs.description || $.trim(attrs.description) === "") {
        return "Enter description";
      }
    },
    
    move: function(x,y) {
      this.set({"x": x, "y": y}, {silent: true});
    },
    
    generateRandomPosition: function() {
      this.set({
        x: Math.floor(Math.random()*600),
        y: Math.floor(Math.random()*342)}, 
        {silent: true});
    }
  });

  /* *********************************************************************** */
  /*  GraphNode Model - wrapper around an Arbor.js node.                     */
  /* *********************************************************************** */
  hubbubApp.GraphNode = Backbone.Model.extend({

    // Has an attribute: arborNode 

  });

  /* *********************************************************************** */
  /*  GraphEdge Model - wrapper around an Arbor.js edge.                     */
  /* *********************************************************************** */
  hubbubApp.GraphEdge = Backbone.Model.extend({

    // Has an attribute: arborEdge
    
  });

  /* *********************************************************************** */
  /*  GlyphNode Model - wrapper around a Raphael.js text/rectangle.          */
  /* *********************************************************************** */
  hubbubApp.GlyphNode = Backbone.Model.extend({

    // Has attributes:
    // id -- id of the associated item
    // text, rect -- raphael.js glyphs
    // boundingBox -- JSON object with left, right, top, and bottom

    containsPoint: function(x, y){
      var bb = this.get("boundingBox");

      return x > bb.left && x < bb.right &&
             y > bb.top  && y < bb.bottom;
    }
    
  });

  /* *********************************************************************** */
  /*  GlyphEdge Model - wrapper around a Raphael.js line.                    */
  /* *********************************************************************** */
  hubbubApp.GlyphEdge = Backbone.Model.extend({

    // Has an attribute: line
    
  });

  /*  --- Collections ------------------------------------------------------ */

  /* *********************************************************************** */
  /*  Item Collection -- the complete set of items.                          */
  /* *********************************************************************** */
  hubbubApp.ItemList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: hubbubApp.Item,
    url :'/items'
  });

  /* *********************************************************************** */
  /*  GraphNode Collection - the set of Arbor.js nodes.                      */
  /* *********************************************************************** */
  hubbubApp.GraphNodeList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: hubbubApp.GraphNode
  });

  /* *********************************************************************** */
  /*  GraphEdge Collection - the set of Arbor.js edges.                      */
  /* *********************************************************************** */
  hubbubApp.GraphEdgeList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: hubbubApp.GraphEdge
  });

  /* *********************************************************************** */
  /*  GlyphNode Collection - the set of Raphael.js node glyphs.              */
  /* *********************************************************************** */
  hubbubApp.GlyphNodeList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: hubbubApp.GlyphNode,

    findByPosition: function(x, y) {
      var foundGlyphNode = null;
      this.each(function(glyphNode){
        if (glyphNode.containsPoint(x, y)) {
          foundGlyphNode = glyphNode;
        }
      });

      return foundGlyphNode;
    }
  });

  /* *********************************************************************** */
  /*  GlyphEdges Collection - the set of Raphael.js edge glyphs.             */
  /* *********************************************************************** */
  hubbubApp.GlyphEdgeList = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: hubbubApp.GlyphEdge
  });

  // Instantiate our collections
  hubbubApp.Items = new hubbubApp.ItemList();

  hubbubApp.GraphNodes = new hubbubApp.GraphNodeList();
  hubbubApp.GraphEdges = new hubbubApp.GraphEdgeList();

  hubbubApp.GlyphNodes = new hubbubApp.GlyphNodeList();
  hubbubApp.GlyphEdges = new hubbubApp.GlyphEdgeList();

  /*  --- Views ------------------------------------------------------------ */

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

      // Construct all managers
      this.hoverMenuManager =
        new hubbubApp.HoverMenuManager(this.addItemView.show);

      this.glyphListener = new hubbubApp.GlyphManager();

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

  /*  --- Other Objects ---------------------------------------------------- */

  /* *********************************************************************** */
  /*  Renderer -- render all the arbor.js nodes                              */
  /* *********************************************************************** */
  hubbubApp.Renderer = function() {
    var paper = $('#forest');
    var particleSystem;

    var renderer = {};

    renderer.init = function(system){
      // the particle system will call the init function once, right before the
      // first frame is to be drawn. it's a good place to set up the canvas and
      // to pass the canvas size to the particle system
      //
      // save a reference to the particle system for use in the .redraw() loop

      particleSystem = system;

      // inform the system of the screen dimensions so it can map coords for us.
      // if the canvas is ever resized, screenSize should be called again with
      // the new dimensions
      particleSystem.screenSize(paper.width, paper.height);
      particleSystem.screenPadding(80); // leave an extra 80px of whitespace per side
    };

    renderer.redraw = function(){
      //
      // redraw will be called repeatedly during the run whenever the node positions
      // change. the new positions for the nodes can be accessed by looking at the
      // .p attribute of a given node. however the p.x & p.y values are in the coordinates
      // of the particle system rather than the screen. you can either map them to
      // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
      // which allow you to step through the actual node objects but also pass an
      // x,y point in the screen's coordinate system
      //



      // particleSystem.eachEdge(function(edge, pt1, pt2){
      //   // edge: {source:Node, target:Node, length:#, data:{}}
      //   // pt1:  {x:#, y:#}  source position in screen coords
      //   // pt2:  {x:#, y:#}  target position in screen coords
      //
      //   // draw a line from pt1 to pt2
      //
      // })
      //
      // particleSystem.eachNode(function(node, pt){
      //   // node: {mass:#, p:{x,y}, name:"", data:{}}
      //   // pt:   {x:#, y:#}  node position in screen coords
      //
      //   // change the node's text position to pt
      //
      // })
    };
    return renderer;
  };

  /* *********************************************************************** */
  /*  Hover Menu Manager -- handle showing and hiding of the hover menu.     */
  /* *********************************************************************** */
  hubbubApp.HoverMenuManager = function(showAddItemDialog) {

    var hoverMenuManager = {};

    // Find the bounding box of the current hover menu
    this.getHoverBox = function() {
      if(this.currentGlyphNode) {
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
    };

    // Find the minimal bounding box that contains the both the hover menu
    // and the current item text
    this.getBoundingBox = function(glyphNode) {
      var hoverBox = this.getHoverBox();         // Hover menu bounding box
      var itemBox = glyphNode.get("boundingBox"); // Item's bounding box

      // TODO We need to address why this needs a +86 on the y value
      return {top:    Math.min(hoverBox.top,    itemBox.top), // y  = top
              left:   Math.min(hoverBox.left,   itemBox.left),    // x  = left
              right:  Math.max(hoverBox.right,  itemBox.right),   // x2 = right
              bottom: Math.max(hoverBox.bottom, itemBox.bottom)};  // y2 = bottom
    };

    this.getPaddedBoundingBox = function(currentGlyphNode) {
      var boundingBox = this.getBoundingBox(currentGlyphNode);
      var PADDING = 20;

      return {top:    boundingBox.top    - PADDING,
              left:   boundingBox.left   - PADDING,
              right:  boundingBox.right  + PADDING,
              bottom: boundingBox.bottom + PADDING};
    };

    // Check whether or not the given point is outside of the given rectangle
    this.isOutside = function(point, rectangle) {
      return point.x < rectangle.left  ||
             point.x > rectangle.right ||
             point.y < rectangle.top   ||
             point.y > rectangle.bottom;
    };

    // This function needs help! Call showHoverMenu from this function.
    this.refreshHoverMenu = function(cursorX, cursorY) {
      var glyphNode = hubbubApp.GlyphNodes.findByPosition(cursorX, cursorY);

      if (glyphNode !== null) {
        this.showHoverMenu(glyphNode);
      } else if(this.currentGlyphNode){
        var boundingBox = this.getPaddedBoundingBox(this.currentGlyphNode);
        if (this.isOutside({x:cursorX, y:cursorY}, boundingBox)) {
           // Destroy the hover menu
           $(".hover_menu").parent().empty().remove();

           // There is no longer a current text
           this.currentGlyphNode = null;
        }        
      }
    };

    // This function needs help!
    this.showHoverMenu = function(glyphNode) {
      var itemId = glyphNode.get("id");
      var boundingBox = glyphNode.get("boundingBox");
      
      // Store the current text so that we can destroy the hover menu later
      this.currentGlyphNode = glyphNode;

      // Clean up any open hover menus
      try {
        $(".hover_menu").parent().empty().remove();
      } catch (err) {
        // don't complain
      }

      // Create a new hover menu
      // To compensate the size of the text box we added few more pixels
      var hoverMenuView = new hubbubApp.HoverMenuView({
        showAddItemDialog: showAddItemDialog,
        top: boundingBox.bottom+83, left:boundingBox.left+10, id: itemId  //Capture the Item id here
      });

      // Append it to the DOM
      $('#forest').append($(hoverMenuView.render().el));
    };

    // Refresh the hover menu whenever the mouse moves
    var that = this;
    $('#forest').mousemove(function(e){
      that.refreshHoverMenu(e.pageX-20, e.pageY-180);
    });

    return hoverMenuManager;
  };
          //Pointer to the context of the Forest View
//      var that = this;
//      text.mouseover(function(){
//
//
//      });

  /* *********************************************************************** */
  /*  LayoutManager - Compute the position of objects over time.             */
  /* *********************************************************************** */
  hubbubApp.LayoutManager = function() {

    // Create a new layoutManager to populate and return
    var layoutManager = {};

    // Build a particle system and set its renderer
    this.particleSystem = arbor.ParticleSystem();
    this.particleSystem.renderer = hubbubApp.Renderer();

    // Create a GraphNode to represent a given Item
    this.addGraphNode = function(itemId, x, y) {
      var arborNode = this.particleSystem.addNode(itemId, {'x':x, 'y':y});
      var graphNode = new hubbubApp.GraphNode({"arborNode": arborNode});
      hubbubApp.GraphNodes.add(graphNode);
    };

    // Create a GraphEdge to represent a given parent-child relationship
    this.addGraphEdge = function(itemId, parentId) {
      if (parentId !== null &&
          parentId !== undefined) {
        var arborEdge = this.particleSystem.addEdge(
          parentId, itemId, {length:0.75});

        var graphEdge = new hubbubApp.GraphEdge({"arborEdge":arborEdge});
        hubbubApp.GraphEdges.add(graphEdge);
      }
    };

    // Load the entire collection
    this.loadItems = function(items) {

      // Create a graph node for each item, and add it to the collection
      items.each(function(item){
        this.addGraphNode(item.get("id"), item.get("x"), item.get("y"));
      }, this);

      // Create an edge to represent each parent-child relationship
      items.each(function(item){
        this.addGraphEdge(item.get("id"), item.get("parent_id"));
      }, this);
    };

    // Add a graph node (and potentially edge) to represent this item
    this.addItem = function(item) {
      var itemId = item.get("id"), parentId = item.get("parent_id"),
          x = item.get("x"), y = item.get("y");

      // Create a graph node for this item, and add it to the collection
      this.addGraphNode(itemId, x, y);

      // If the item has a parent, create an edge to represent the connection
      this.addGraphEdge(itemId, parentId);
    };
    
    // Remove the graph node (and potentially edge) associated with this item
    this.removeItem = function(item) {
      
    };

    // Listen for changes to the Items collection
    hubbubApp.Items.bind("reset",  this.loadItems, this);
    hubbubApp.Items.bind("add",    this.addItem, this);
    hubbubApp.Items.bind("remove", this.removeItem, this);

    // Return the newly created layoutManager
    return layoutManager;
  };

  // Construct a new layout manager at the top level
  hubbubApp.LayoutListener = new hubbubApp.LayoutManager();
  
  /* *********************************************************************** */
  /*  GlyphManager - Renders the glyphs to Raphael's paper.                  */
  /* *********************************************************************** */
  hubbubApp.GlyphManager = function() {

    // Create a new glyphManager to populate and return
    var glyphManager = {};

    this.paper = new Raphael(
      'forest', $('#forest').width(), $('#forest').height());

    // Add text to represent a newly-created item
    this.addItem = function(graphNode) {
      
      var arborNode = graphNode.get("arborNode");
      var x = arborNode.p.x, y = arborNode.p.y;
  
      var foundItem = hubbubApp.Items.get(arborNode.name);
      
      if (foundItem !== null) {
        // Set the text
        var text = this.paper.text(x, y, foundItem.get("description"));
        text.attr("font-size", 32);

        var textWidth = text.getBBox().width + 15;
        var textHeight = text.getBBox().height + 15;

        // Create rectangle for visual effect
        var boundingBox = {
          left:   x-(textWidth/2),
          right:  x+(textWidth/2),
          top:    y-(textHeight/2),
          bottom: y+(textHeight/2)};

        var rect = this.paper.rect(
          boundingBox.left, boundingBox.top,
          boundingBox.right  - boundingBox.left,
          boundingBox.bottom - boundingBox.top);

        rect.attr("r", "10");
        rect.attr("stroke-width", "2");
        rect.attr("stroke", "#626CF7");
        rect.attr("fill", "#CDD1FC");

        rect.toFront();
        text.toFront();

        // Create a new glyph node and add it to our collection
        var glyphNode = new hubbubApp.GlyphNode({
          id: arborNode.name, text: text, rect: rect,
          boundingBox: boundingBox});

        hubbubApp.GlyphNodes.add(glyphNode);
      }
    };

    // Add a line to represent the new parent-child relationship
    this.addEdge = function (graphEdge) {

      var source = graphEdge.get("arborEdge").source;
      var target = graphEdge.get("arborEdge").target;

       // Draw a line from the parent to the child
       line = this.paper.path(
         "M" + source.p.x + " " + source.p.y + "L" +
               target.p.x + " " + target.p.x);

       line.attr("stroke-width", "2");
       line.attr("stroke", "#626CF7");
       line.toBack();

      // Create a new glyph edge and add it to our collection
      var glyphEdge = new hubbubApp.GlyphEdge({"line": line});
      hubbubApp.GlyphEdges.add(glyphEdge);
    };

    // Listen for changes to the GraphNodes and GraphEdges collections
    hubbubApp.GraphNodes.bind("add",  this.addItem, this);
    hubbubApp.GraphEdges.bind("add",  this.addEdge, this);

    // Return the newly created glyphManager
    return glyphManager;
  };

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
