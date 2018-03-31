
$(document).ready(function() {

    $.get("http://localhost:5000/candidates",  function(data)
    {
        data.forEach(function(element) {
            $('#candidateTable tbody').append('<tr><td>'+element.candidateName+'</td><td>'+element.votes+'</td></tr>');
        });

        $('#canidateSelect').append(
        '<option disabled selected value="default"> -- select an option -- </option>');

        data.forEach(function(element) {
            $('#canidateSelect').append('<option value="'+element.candidateName+'">'+
            element.candidateName + '</option>');
        });
    });

});

function vote()
{
    var attr = $('#voteButton').attr('disabled');

    if (!(typeof attr !== typeof undefined && attr !== false))
    {
        option = $('#canidateSelect').find('option:selected').attr('value')
        console.log(option)
        data = { userAddress: $("#userAddress").val(), candidateName: option }
        $.ajax({
          type: "POST",
          url: "http://localhost:5000/vote",
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          dataType: "json"
        });
    }
}

function checkVoteEnabled()
{
    option = $('#canidateSelect').find('option:selected').attr('value')
    if( option !== "default" && $("#userAddress").val() !== "")
    {
        $('#voteButton').removeAttr('disabled')
    }
    else
    {
        $('#voteButton').attr('disabled', true)
    }


}


function canidateSelect()
{
    checkVoteEnabled()
}
