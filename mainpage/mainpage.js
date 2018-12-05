let currId = 0;
let numLanguages = 0;
let debounceBool = true;

let languageList = {};

let translateConfig = {
    sentence: '',
    languages: ''
};

function translateScore() {
    var servResponse;
    $.ajax({
        url: '/translate_score',
        type: 'GET',
        data: {
            sentence: translateConfig["sentence"],
            languages: translateConfig["languages"]
        },
        contentType: "application/json; charset=utf-8",

        success: function (result) {
            console.log(result);
            $('#loading-gif').css('display', 'none');
            $('#results').css('visibility', 'visible');
            $('#translated-text').html(result["sentence"]);
            $('#score').html(result["score"]);
        },
        error: function (err) {
            console.log(`Error: ${err}`)
        }
    });
}
/*
*   Gets the current language list
*/
function getLanguageList() {
    //Get the language list
    var servResponse;
    $.ajax({
        url: '/get_langs',
        type: 'GET',
        async: false,

        success: function (result) {
            servResponse = result;
        },
        error: function (err) {
            console.log(`Error: ${err}`)
        }
    })
    return servResponse;
}

/*
*   Checks the text that in the box and adds it to html
*   and the array if it is valid
*/
function addToListOfLanguages() {
    // add to list of languages and clear text
    let languageSelected = $('input.autocomplete').val();
    if (languageList[languageSelected] === undefined) {
        // language does not exist, handle
        $('#error-div').html('Error: Language does not exist');
        $('#error-div').css('display', 'block');
        return;
    }
    else if (numLanguages > 10) {
        $('#error-div').html('Error: You can only add up to 10 languages');
        $('#error-div').css('display', 'block');
    }
    else {
        addLanguageBox(languageSelected);
        currId++;
        numLanguages++;
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
function remove(id) {
    $('#' + id).remove();
    numLanguages--;
}

/*
*   Gets all the languages that are currently selected
*/
function getSelectedLanguages() {
    let languageList = "";
    $('#languages').find('div').each(function () {
        let innerDivId = $(this).attr('id');
        languageList += ($('#' + innerDivId + ' span').html() + ",");
    });
    languageList += 'English';
    return languageList;
}

function getText() {
    let fullText = $('#text-box').val();
    return fullText;
}

$(document).ready(() => {
    languageList = getLanguageList();
    $('select').formSelect();
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    $('#garble-text-btn').click(() => {
        $('#results').css('visibility', 'hidden');
        $('#loading-gif').css('display', 'block');
        translateConfig["sentence"] = getText();
        translateConfig["languages"] = getSelectedLanguages();
        // translateConfig["sentence"] = "Hello, my deodorant smells like my wallet and keys.";
        // translateConfig["languages"] = "Polish,Igbo,French,English"
        translateScore();
    });

    $('input.autocomplete').autocomplete({
        data: languageList,
        onAutocomplete: () => {
            debounceBool = false;
            addToListOfLanguages();
            // this prevents the function being called by the enter listener
            setTimeout(() => {
                debounceBool = true;
            }, 400)
        }
    });
    $('input.autocomplete').on('keyup', (event) => {
        // listens for enter event inside the field
        if (event.key === 'Enter' && debounceBool) {
            // key is enter add to list after verificiation
            addToListOfLanguages();
        }
        else {
            $('#error-div').css('display', 'none');
        }
    });
    $('#languages').sortable();

    $('.logout').click(() => {
        document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        window.location.replace('/login');
    });
});
