/**
 * Constructor for the Character Tiles that will populate the index grid
 * @param {integer} id - a unique characterId
 * @param {string} name - Character name
 * @param {string} photoUrl - base URL for associated character assets
 * @param {string} photoType - extension provided from API
 */
function CharacterTile(id, name, photoUrl, photoType) {

  var squareImgPrefix = "/standard_xlarge"
  var OUTER_CONT_CLASS = "outerTileCont col-md-3"
  var INNER_CONT_CLASS = "innerTileCont"
  var SPACER_CLASS = "spacer"

  var mainCont = $("<div/>", {
    "class": OUTER_CONT_CLASS,
    "id": "characterOuter"+id
  }).append($("<div/>", {
    "class": INNER_CONT_CLASS,
    "id": "characterInner"+id
  }).css("background-image", "url("+photoUrl+squareImgPrefix+photoType+")")
    .append($("<h2/>", {
    "id": "characterName"+id
  }).wrapInner($("<span/>", {
    "class": SPACER_CLASS,
    "text": name
  })))).on( "click", function(data) {
    console.log(name)
    characterController.callServer(id,name)
  });

  return mainCont
}


