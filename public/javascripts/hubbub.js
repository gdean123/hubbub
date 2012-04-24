var createAddItemDialog = function() {
  $("#dialog").dialog({
    autoOpen: false,
    modal: true,
    width: 510,
    height: 220,
    buttons: [
      { text: "OK",
        class: "create",
        click: function() {  }},
      { text: "Cancel",
        class: "cancel",
        click: function() {  }}
    ]
  });
  
  createToolTip("description", "Enter description");
  createToolTip("details", "Enter details");
}

var createHoverMenu = function() {
	$('.item').qtip({
		content: '<img src="images/add_item.png"/>'
	});
}

var createToolTip = function(id, contentText){
  $("#"+id).qtip({
    content: contentText,
    style: { 
          width: 200,
          padding: 5,
          textAlign: 'center',
          border: {
             width: 7,
             radius: 5,
          },
          tip: 'bottomLeft',
          name: 'dark' // Inherit the rest of the attributes from the preset dark style
    },
    position: {
          corner: {
             target: 'topMiddle',
             tooltip: 'bottomLeft'
          }
    },    
    show: { solo: true },
    hide: { delay: 1000 }
  });
}