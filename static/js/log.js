function logInit(){
  // pseudo = "onche_onche";
  // $("#log_container").remove();
  // $("body").load("www/game.html");
}
$("#input_pseudo").keypress(function(e){
  if ( e.which == 13 ) {
    submit();
  }
});
$("#submit").click(function() {
  submit();
});

function submit(){
  $(".error").hide();
  if ($("#input_pseudo").val().length < 20) {
    if ($("#input_pseudo").val().length > 3) {
      if (/^[a-zA-Z0-9- ]*$/.test($("#input_pseudo").val())) {
        pseudo = $("#input_pseudo").val();
        $("#log_container").remove();
        $("body").load("www/menu.html");
      } else {
        $("#err_char").show();
      }
    } else {
      $("#err_length_min").show();
    }
  } else {
    $("#err_length_max").show();
  }
  return false;
}
