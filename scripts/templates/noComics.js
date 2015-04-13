/**
 * Constructor for a no-comics available element
 */

function NoComics() {

  var COMPONENT_CLASS = "noComics col-md-12"

  var noComics = $("<div/>", {
    "class": COMPONENT_CLASS
  }).append($("<h2/>", {
    text: "No Comics Available for this Character!"
  }))

  return noComics
}


