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
    ready: false,
    //corner: {
    //    target: bottomLeft,
    //    tooltip: topLeft
    //},
    show: null,
    hide: null
  })
}

$(document).ready(function() {
  createAddItemDialog();
});