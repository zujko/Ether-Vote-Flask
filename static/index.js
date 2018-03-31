
$(document).ready(function() {

    $.get("http://localhost:5000/candidates",  function(data)
    {
        console.log(data)
        data.forEach(function(element) {
            $('#candidateTable tbody').append('<tr><td>'+element.candidateName+'</td><td>'+element.votes+'</td></tr>');
        });

        $('#canidateSelect').append(
        '<option disabled selected value> -- select an option -- </option>');

        data.forEach(function(element) {
            $('#canidateSelect').append('<option value="'+element.candidateName+'">'+
            element.candidateName + '</option>');
        });
    });

});

function vote()
{
    
    data = { userAddress: $("#userAddress").val(), candidateName: $("#candidate").val() }
    $.ajax({
      type: "POST",
      url: "http://localhost:5000/vote",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    });

}

function canidateSelect()
{
    $('#canidateSelect').append()
    '<option disabled selected value> -- select an option -- </option>');
}
