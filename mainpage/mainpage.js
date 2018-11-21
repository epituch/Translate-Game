$(document).ready(() => {
    $('select').formSelect();
    $(".dropdown-trigger").dropdown();
    $('#garble-text-btn').click(() => {
        $('#results').css('visibility', 'visible');
    });
});
