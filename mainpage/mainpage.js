let selectedLanguages = [];
let currId = 0;

// TODO: call server for list of languages
let languageList = {
    "English": null,
    "Spanish": null,
    "Polish": null,
    "Hindi": null
};

/*
*   Checks the text that in the box and adds it to html
*   and the array if it is valid
*/
function addToListOfLanguages(checkInput) {
    // add to list of languages and clear text
    let languageSelected = $('input.autocomplete').val();
    if (languageList[languageSelected] === undefined) {
        // language does not exist, handle
        $('#error-div').css('display', 'block');
    }
    else {
        addLanguageBox(languageSelected);
        let langObject = {
            "id": currId,
            "language": languageSelected
        }
        currId++;
        selectedLanguages.push(langObject);
        M.Autocomplete.getInstance($('input.autocomplete')).close();
        $('input.autocomplete').val('');
    }
}

/*
*   Adds language to html and adds listener
*/
function addLanguageBox(language) {
    $('#languages').append(
        "<div class='language' id='" + currId + "'><span>" + language + "</span><i class='material-icons tiny' onclick='remove(" + currId + ")'>close</i></div>"
    );
}

/*
*   Removes the language that corresponds to the id
*/
function remove(id){
    $('#' + id).remove();
    selectedLanguages = selectedLanguages.filter( langObject => langObject.id !== id);
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
