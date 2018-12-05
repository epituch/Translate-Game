$(document).ready(() => {
    $('.sidenav').sidenav();

    $.ajax({
        url: '/leaderboarddata',
        type: 'GET',

        success: function (result) {
            setTable(result);
        },
        error: function (err) {
        }
    });
    $('.logout').click(() => {
        document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        window.location.replace('/login');
    });
});

/*
*   Sets all the data in the table to whatever the server sends back
*   @param table data from the database
*/
function setTable(dbData) {
    let username;
    let score;
    for (let i = 0; i < 20; i++) {
        if (dbData[i] !== undefined) {
            // object exists so just print it out
            username = dbData[i].username === undefined ? "" : dbData[i].username;
            score = (dbData[i].score === undefined || dbData[i].score === 0) ? "-" : dbData[i].score;
        }
        else {
            // object does not exist
            username = "";
            score = "";
        }
        $('#table-head').append("<tr><td>" + (i + 1) + "</td><td>" + username + "</td><td>" + score + "</td></tr>");
    }
}