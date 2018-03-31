function makeElection()
{
    data = { title: $('#titleText').val(), author: $('#userAddressText').val(),
        voters: $('#voterList').val(), canidates: $('#canidateList').val()}

    $.ajax({
        type: "POST",
        url: "http://localhost:5000/createNewElection",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success:function(data) {
            console.log(data);
            $("#showMessage").empty();
            $("#showMessage").append(data);
        }
    });

}
function handleData(data)
{
    console.log(data);
}
