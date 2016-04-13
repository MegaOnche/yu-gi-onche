$(document).ready(function() {
  function addMessage(pseudo, mess, nclass) {
    if (nclass != "info")
      $("#mess_zone ul").append('<li class="' + nclass + '"><div class="pseudo">' + pseudo + ':</div><div class="mess"> ' + mess + '</div></li>');
    else
      $("#mess_zone ul").append('<li class="' + nclass + '"><div class="info">' + mess + '</div></li>');

    $("#mess_zone").scrollTop($("#mess_zone")[0].scrollHeight);
  }

  $("#send").click(function() {
    send();

  });
  $("#mess").keypress(function(e) {
    if (e.which == 13) {
      send();
    }
  });

  function send() {
    socket.emit('message', $("#mess").val());
    $("#mess").val('');
  }


  socket.emit('nouveau_client', pseudo);

  socket.on('message', function(data) {
    addMessage(data.pseudo, data.message, "message");
  });

  socket.on('nouveau_client', function(data) {
    // refreshUserList(data.userList);
    if (data.pseudo != pseudo)
      addMessage(null, data.pseudo + " s\'est connecté", "info");
  });
  socket.on('deconnection', function(data) {
    // refreshUserList(data.userList);
    addMessage(null, data.pseudo + ' s\'est déconnecté !', 'info');
  });
});
