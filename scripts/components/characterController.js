/**
 * @author Joe Sangiorgio
 * The characterController will maintain all information about the Browse Menu Page,
 * perform initial configuration, and provide methods to interact with it
 */
var characterController = (function () {
  var characterController = {};
  var currPagination;
  var currSpinner;
  var currLetter = "a"
  var noImgPath = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
  //div that houses the loading spinner
  var spinnerHolder = $(".spinnerHolder")

  //URL constants, modify here in case of API change/new key issued
  var APIURL = "http://gateway.marvel.com:80/v1/public/";
  var CHARACTER_FETCH_STR = "characters?";
  var CALL_LIMIT = 12;
  var ORDER_STR = "name";
  var PUBLIC_KEY = "c467c874374c4d34ef51b728075fe970";


  /**
   * Function that will call the marvel API and direct the returned data through the page
   * @param {integer} inLetter - The alphabetical character to query with
   * @param {string} offset - The numeric amount results should be offset by
   */
  function callAPI(inLetter,offset) {

    //use a as default, first call
    var useLetter = (inLetter) ? inLetter : "a";
    currLetter = useLetter
    var useOffset = (offset) ? offset : 0;

    console.log("Top of Character API Call: " + useLetter +" -- "+ useOffset)
    //parameters necessary to obtain the correct results
    var params = {
      nameStartsWith: useLetter,
      orderBy: ORDER_STR,
      limit: CALL_LIMIT,
      offset: useOffset,
      apikey: PUBLIC_KEY
    };

    //construct fullURL
    var fullURL = APIURL + CHARACTER_FETCH_STR + $.param(params);

     return $.ajax(fullURL)
       .done(function (data) {

         //remove spinner from the page
         try {
           currSpinner.remove()
         }
         catch(err) {
           $(".spinner").remove()
         }
        //if there are more than CALL_LIMIT characters that start with the letter, we need to create pagination. use offset
        //to tell if it has already been created
        currPagination = (data.data.total > CALL_LIMIT && (isNaN(Number(offset)))) ? createPagination(data.data.total,CALL_LIMIT) : currPagination;

         //use the returned information to populate the page
        populateCharacterContainer(data.data.results)

      })
      .fail(function () {
        console.log("fail");
      })

  }

  /**
   * Once a user has clicked a character, call this function to go to the Digital Comics by Character Page
   * @param {integer} characterId - The characterId of the character that has been clicked
   * @param {name} name - The name of the character
   *
   */
  characterController.callServer = function(characterId,name){
    document.location.href = "comics.html?"+name+"#"+characterId
  }

  /**
   * Once API Call has returned, this function will be used to populate the page
   * @param {array} characterArr - An array of character objects obtained from the API
   *
   */
  function populateCharacterContainer(characterArr) {

    for (var i = 0; i < characterArr.length; i++) {
      var currCharacter = characterArr[i]

      var imgPath = (currCharacter.thumbnail) ? currCharacter.thumbnail.path : noImgPath
      var extName = (currCharacter.thumbnail) ? currCharacter.thumbnail.extension : "jpg"

      $(".characterContainer").append(CharacterTile(currCharacter.id,currCharacter.name,imgPath,"."+extName))
    }

  }

  /**
   * Used to create pagination links if there are more than CALL_LIMIT characters returned
   * @param {integer} total - The total amount of characters returned
   *
   */
  function createPagination(total) {

    var pagination = Pagination(currLetter,total,CALL_LIMIT)
    $(".footer").append(pagination)
    return pagination
  }

  /**
   * Callback function utilized after a user selects from the pagination
   * @param {integer} pageNum - The total amount of characters returned
   * @param {element} activePageBtn - The latest button clicked in the pagination
   *
   */
  characterController.goToPage = function (pageNum, activePageBtn) {
    //remove characters at old page
    $(".characterContainer").empty();
    //deselect previous page
    currPagination.children().removeClass("active")
    //select current page
    $(activePageBtn).addClass('active');
    currSpinner=createSpinner(spinnerHolder)
    //call api with corresponding params for current page
    callAPI(currLetter,(pageNum-1)*CALL_LIMIT)
  }

  /**
   * Function called when user chooses a new letter option via dropdown
   * @param {string} inLetter - The letter of the chosen option
   * @param {element} mainBtn - The btn element to be updated
   */
  characterController.filterBy = function (inLetter, mainBtn) {
    console.log("Filtering By: " + inLetter)
    currSpinner=createSpinner(spinnerHolder)

    //clear the character container and remove old pagination
    $(".characterContainer").empty();
    (currPagination) ? currPagination.remove() : $.noop();
    callAPI(inLetter)

    //set text
    mainBtn.text("Showing: " + inLetter + " ").append($('<span/>', {"class": "caret"}));
  }

  /**
   * Initialization function that will call the API for the first time, and eventually
   * trickle down to populate the page
   */
  characterController.init = function () {
    currSpinner=createSpinner(spinnerHolder)
    $.when(callAPI()).done(function (obj,code) {
      console.log("API Call success!");

      //create alphabet dropdown
      $(".header").append(Dropdown("letterDD","ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),"Choose a Letter ",characterController.filterBy))

      })
      .fail(function (obj,code) {
        console.log("API Call Failed!");
      })
  }


  return characterController;
}());
