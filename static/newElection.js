function makeElection()
{
    data = { title: $('#titleText').val(), author: $('#userAddressText').val(),
        voters: $('#voterList').val(), candidates: $('#candidateList').val(),
        timeLimit: $('#timeLimit').val()}

    $.ajax({
        type: "POST",
        url: "http://localhost:5000/createNewElection",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success:function(data) {
            $("#showMessage").empty();
            $("#showMessage").append(data);
        },
        error:function(data) {
            $("#showMessage").empty();
            $("#showMessage").append("error creating election");
        }
    });

}
function handleData(data)
{
    console.log(data);
}
