let selectedLanguages = [];
// TODO: call server for list of languages
let languageList = {
    "English": null,
    "Spanish": null,
    "Polish": null,
    "Hindi": null
};

function addToListOfLanguages(checkInput) {
    // add to list of languages and clear text
    let languageSelected = $('input.autocomplete').val();
    if (languageList[languageSelected] === undefined) {
        // language does not exist, handle
        $('#error-div').css('display', 'block');
    }
    else {
        console.log('Added to list of lanaguages');
        selectedLanguages.push();
        M.Autocomplete.getInstance($('input.autocomplete')).close();
        $('input.autocomplete').val('');
    }
}

$(document).ready(() => {
    $('select').formSelect();
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    $('#garble-text-btn').click(() => {
        $('#results').css('visibility', 'visible');
    });

    $('input.autocomplete').autocomplete({
        data: languageList,
        onAutocomplete: () => {
            addToListOfLanguages();
        }
    });
    $('input.autocomplete').on('keyup', (event) => {
        // listens for enter event inside the field
        if (event.key === 'Enter') {
            // key is enter add to list after verificiation
            addToListOfLanguages();
        }
        else {
            $('#error-div').css('display', 'none');
        }
    });
    $('#languages').sortable();
});
