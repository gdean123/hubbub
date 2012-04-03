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

  $('#description').qtip({
    content: 'Enter description',
    style: { 
          width: 200,
          padding: 5,
          // background: '#A2D959',
          // color: 'black',
          textAlign: 'center',
          border: {
             width: 7,
             radius: 5,
             // color: '#A2D959'
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
  })
}

$(document).ready(function() {
  createAddItemDialog();
});