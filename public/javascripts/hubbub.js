var createAddItemDialog = function() {
  $("#dialog").dialog({
    autoOpen: false,
    modal: true,
    buttons: [
      { text: "OK",
        class: "ok",
        click: function() { $(this).dialog("close"); } },
      { text: "Cancel",
        click: function() { $(this).dialog("close"); } }
    ]
  });
}

$(document).ready(function() {
  createAddItemDialog();
});