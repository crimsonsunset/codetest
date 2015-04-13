/**
 * Constructor for the Comic Tiles that will populate the character by index grid
 * @param {integer} id - a unique comicId
 * @param {array} infoArr - Information to be displayed on the comic tile
 * @param {string} photoUrl - base URL for associated character assets
 * @param {string} photoType - extension provided from API
 */
function ComicTile(id, infoArr, photoUrl, photoType) {

  var portraitImgPrefix = "/portrait_incredible"
  var OUTER_CONT_CLASS = "outerTileCont col-md-3"
  var INNER_CONT_CLASS = "innerTileCont"
  var SPACER_CLASS = "spacer"

  //loop through info to create a string for the inside of the tile
  var fullStr=""
  for (var i = 0; i < infoArr.length; i++) {
    fullStr+= infoArr[i]+"</br>"
  }

  var mainCont = $("<div/>", {
    "class": OUTER_CONT_CLASS,
    "id": "comicOuter"+id
  }).append($("<div/>", {
    "class": INNER_CONT_CLASS,
    "id": "comicInner"+id
  }).css("background-image", "url("+photoUrl+portraitImgPrefix+photoType+")")
    .append($("<h2/>", {
    "id": "comicInfo"+id
  }).wrapInner($("<span/>", {
    "class": SPACER_CLASS,
    "html": fullStr
  })))).on( "click", function(data) {
    console.log("Comic "+ id + " clicked!")
  });

  return mainCont
}


