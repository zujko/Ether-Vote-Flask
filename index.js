
$(document).ready(function() {

    $.get("http://localhost:5000/canidates",  function(data)
    {
        data.forEach(function(element) {
            $('#canidateTable tbody').append('<tr><td>'+element.canidateName+'</td><td>'+element.votes+'</td></tr>');
        });
    });

});

function vote()
{
    data = { userAdress: $("#userAdress").val(), canidateName: $("#candidate").val() }
    $.ajax({
      type: "POST",
      url: "http://localhost:5000/vote",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    });

}
