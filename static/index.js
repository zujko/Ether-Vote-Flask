$(document).ready(function() {

    ur = window.location.href.split('/')
    address = ur[ur.length-1].replace('#', '')
    $.get("http://localhost:5000/candidates/"+address,  function(data)
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

function update_candidates(address) {
    $.get("http://localhost:5000/candidates/"+address,  function(data)
    {
        $('#candidateTable tbody').empty();
        data.forEach(function(element) {
            $('#candidateTable tbody').append('<tr><td>'+element.candidateName+'</td><td>'+element.votes+'</td></tr>');
        });
        $('#canidateSelect').empty();
        $('#canidateSelect').append(
        '<option disabled selected value="default"> -- select an option -- </option>');

        data.forEach(function(element) {
            $('#canidateSelect').append('<option value="'+element.candidateName+'">'+
            element.candidateName + '</option>');
        });
    });
}

function vote(election_address)
{
    var attr = $('#voteButton').attr('disabled');

    if (!(typeof attr !== typeof undefined && attr !== false))
    {
        option = $('#canidateSelect').find('option:selected').attr('value')
        data = { userAddress: $("#userAddress").val(), candidateName: option, electionAddress: election_address}
        $.ajax({
          type: "POST",
          url: "http://localhost:5000/vote",
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          statusCode: {
            403: function() { 
                alert("Invalid operation");
            },
            401: function() {
                alert("Invalid address");
            }
          },
          complete: function(){
                update_candidates(election_address);
          }
        });
    }
}

function checkVoteEnabled(finished)
{
    console.log(finished)
    option = $('#canidateSelect').find('option:selected').attr('value')
    if( option !== "default" && $("#userAddress").val() !== "" && finished == "False")
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
