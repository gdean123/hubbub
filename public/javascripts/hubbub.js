var createAddItemDialog = function() {
  $("#dialog").dialog({
    autoOpen: false,
    modal: true,
    width: 510,
    height: 220,
    buttons: [
      { text: "OK",
        class: "create",
        click: function() { $(this).dialog("close"); } },
      { text: "Cancel",
        click: function() { $(this).dialog("close"); } }
    ]
  });
}

$(document).ready(function() {
  createAddItemDialog();
});