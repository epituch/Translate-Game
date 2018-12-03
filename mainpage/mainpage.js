let currId = 0;

// TODO: call server for list of languages
let languageList = {};

let translateConfig = {
    sentence: '',
    languages: ''
};
// {
//   "sentence": "This is a test",
//   "languages": ["endligh", "spanish"]
// }


function translateScore(){
  var servResponse;
  $.ajax({
      url: '/translate_score',
      type: 'GET',
      async: false,
      //data: JSON.stringify(translateConfig),
      data: {
        sentence: translateConfig["sentence"],
        languages: translateConfig["langauges"]
      },
      contentType: "application/json; charset=utf-8",

      success: function(result){
          console.log(result)
          servResponse = result;

      },
      error: function(err){
          console.log('Error: ${err}')
      }
  })
  return servResponse;

}
/*
*   Gets the current language list
*/
function getLanguageList(){
  //Get the language list
  var servResponse;
  $.ajax({
      url: '/get_langs',
      type: 'GET',
      async: false,

      success: function(result){
          servResponse = result;
      },
      error: function(err){
          console.log('Error: ${err}')
      }
  })
  return servResponse;
}

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
        currId++;
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
}

/*
*   Gets all the languages that are currently selected
*/
function getSelectedLanguages() {
    let languageList = [];
    $('#languages').find('div').each(function () {
        let innerDivId = $(this).attr('id');
        languageList.push($('#' + innerDivId + ' span').html());
    });
    return languageList;
}

function getText(){
  let fullText = $('#text-box').val();
  return fullText;
}

$(document).ready(() => {
    languageList = getLanguageList();
    $('select').formSelect();
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
    $('#garble-text-btn').click(() => {
        $('#results').css('visibility', 'visible');
        // TODO: send languages to the server
        console.log(getSelectedLanguages());
        console.log(getText());
        console.log(getLanguageList());
        /////////////
        // translateConfig["sentence"] = getText();
        // translateConfig["languages"] =  getSelectedLanguages();
        // let response = translateScore();
        // $('#translated-text').val(response["sentence"]);
        // $('#score').val(response["score"]);

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
