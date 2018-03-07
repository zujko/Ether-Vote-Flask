
$(document).ready(function() {

    $.get("http://localhost:5000/canidates",  function(data)
    {
        //var data = [{canidateName: 'joe', votes: 20}]
        console.log(data)
        data.forEach(function(element) {
            $('#canidateTable tbody').append('<tr><td>'+element.canidateName+'</td><td>'+element.votes+'</td></tr>');
        });
    });

});

function vote()
{
    data = { userAdress: $("#userAdress").val(), canidateName: $("#candidate").val() }
    console.log(data)
    $.ajax({
      type: "POST",
      url: "localhost:5000",
      data: data,
      dataType: "json"
    });

}
