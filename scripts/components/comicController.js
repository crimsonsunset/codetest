/**
 * @author Joe Sangiorgio
 * The comicController will maintain all information about the Digital Comics by Character Page,
 * perform initial configuration, and provide methods to interact with it
 */
var comicController = (function () {
  var comicController = {};
  var currSpinner;
  var noImgPath = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available";
  //will be used to populate comic labels
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var characterId;
  var totalComics;
  //used to populate dropdown
  var sortOptionsArr = [
    "focDate",
    "onsaleDate",
    "title",
    "issueNumber",
    "modified",
    "focDate (Descending)",
    "onsaleDate (Descending)",
    "title (Descending)",
    "issueNumber (Descending)",
    "modified (Descending)"
  ];
  //div that houses the loading spinner
  var spinnerHolder = $(".spinnerHolder")

  //URL constants, modify here in case of API/URL change/new key issued or to change layout of the page
  var APIURL = "http://nodejs-joesapp.rhcloud.com/marvel?";
  var CALL_LIMIT = 20;
  var OFFSET = 0;

  /**
   * Function that will call the node server, routing the comic data from marvel API through a server-side call
   * @param {integer} offset - The numeric amount results should be offset by
   * @param {string} orderBy - The way in which results should be ordered by. Will be populated through dropdown or by title as default
   */
  function callAPI(offset,orderBy) {

    //sanity-check, log the ID when you call the function
    var currComic = (!characterId) ? console.err("NO CHARACTERID") : console.log("char id is: " + characterId)

    //use a as default, first call
    var useOffset = (offset) ? offset : 0;
    var useOrderBy = (orderBy) ? orderBy : "title";

    console.log("Top of Comic API Call: " + useOrderBy +" -- "+ useOffset)
    //parameters necessary to obtain the correct results
    var params = {
      limit: CALL_LIMIT,
      offset: useOffset,
      characterId: characterId,
      orderBy: useOrderBy

    };
    //construct fullURL
    var fullURL = APIURL + $.param(params);

     return $.ajax(fullURL)
       .done(function (data) {

         //remove spinner from the page
         try {
           currSpinner.remove()
         }
         catch(err) {
           $(".spinner").remove()
         }

         var response = JSON.parse(data)
         //save this to check if infinite scrolling is finished later on
         totalComics = response.data.total;
         (totalComics>0) ? populateComicContainer(response.data.results) : $(".comicContainer").append(NoComics())

      })
      .fail(function () {
        console.log("fail");
      })

  }
  /**
   * Once API Call has returned, this function will be used to populate the page
   * @param {array} comicArr - An array of comic objects obtained from the API
   *
   */
  function populateComicContainer(comicArr) {

    for (var i = 0; i < comicArr.length; i++) {
      var currComic = comicArr[i]

      // ensure the default gets used for comics without an image provided
      var imgPath = (currComic.thumbnail) ? currComic.thumbnail.path : noImgPath
      var extName = (currComic.thumbnail) ? currComic.thumbnail.extension : "jpg"


      //if the title has parenthesis, remove unnecessary parts of the title
      var shortenedTitle =  (currComic.title.indexOf("(") != -1) ? currComic.title.substr(0,currComic.title.indexOf("(")-1) : currComic.title;

      //parse through the date array, utilizing the onsale date for display purposes
      var releaseDateArr = $.grep(currComic.dates, function( a ) {
        return (a.type == "onsaleDate")
      });

      //use the moment library to parse out a more human-friendly date
      var date = moment(releaseDateArr[0].date)

      //check that date passed in was valid/ingested correctly by moment.js
      var parsedDate = (isNaN(date.month())) ? "No Date Available" : months[date.month()] + " " + date.date() + ", " + date.year()

      //construct infoArr to pass into ComicTile Template
      var infoArr = [shortenedTitle, parsedDate,"ID: " + currComic.id]
      var issueNumber =  (currComic.issueNumber > 0 ) ? "Issue# "+currComic.issueNumber : null;
      (issueNumber) ? infoArr.push(issueNumber) : $.noop();

      //can now use our parsed information to construct a ComicTile
      $(".comicContainer").append(ComicTile(currComic.id, infoArr,imgPath, "."+extName ))
    }


    //register listener for infinite-scrolling [with jquery]
    //$(".comicContainer").scroll(function(e) {
    //  var elem = $(e.currentTarget);
    //  //register listener for infinite-scrolling
    //  if (elem[0].scrollHeight - elem.scrollTop() <= elem.outerHeight())
    //  {
    //    if (OFFSET <= totalComics) {
    //      console.log("REACHED BOTTOM, CALLING")
    //      OFFSET+=CALL_LIMIT
    //      callAPI(OFFSET)
    //
    //    } else {}
    //  }else{}
    //})



    //register listener for infinite-scrolling [without jquery]
    document.getElementsByClassName("comicContainer")[0].addEventListener("scroll", function (event) {

        //register listener for infinite-scrolling
        if (event.target.scrollHeight - event.target.scrollTop <= event.srcElement.clientHeight)
        {
          if (OFFSET <= totalComics) {
            console.log("Bottom of container hit, calling API for more results")
            OFFSET+=CALL_LIMIT
            currSpinner=createSpinner(spinnerHolder)
            callAPI(OFFSET)

          } else {
            console.log("Got all the comics already!")
          }
        }else{}
    });

  }

  /**
   * Function called when user chooses a new sorting option via dropdown
   * @param {string} inText - The text of the chosen option
   * @param {element} mainBtn - The btn element to be updated
   */
  comicController.sortBy = function (inText, mainBtn) {

    mainBtn.text("Sorted By: " + inText + " ").append($('<span/>', {"class": "caret"}))
    var sortStr =  (inText.indexOf("(") != -1) ? "-"+inText.substr(0,inText.indexOf("(")-1) : inText;

    //clear the comic container and reset offset
    OFFSET=0
    $(".comicContainer").empty();
    currSpinner=createSpinner(spinnerHolder)
    callAPI(undefined,sortStr)

  }

  /**
   * Initialization function that will call the API for the first time, and eventually
   * trickle down to populate the page
   */
  comicController.init = function () {
    currSpinner=createSpinner(spinnerHolder)
    characterId = window.location.hash.substring(1)
    $.when(callAPI()).done(function (obj,code) {
      console.log("API Call success!");

      //create dropdown
      $(".header").append(Dropdown("sortDD",sortOptionsArr,"Sorted By: Title ", comicController.sortBy))
      //parse character name out of URL, decode it in case of spaces or special characters
      $("#characterName").text(decodeURIComponent(location.search.substring(1)))

    })
      .fail(function (obj,code) {
        console.log("API Call Failed!");
      })
  }


  return comicController;
}());
