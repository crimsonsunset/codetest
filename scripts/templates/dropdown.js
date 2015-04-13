/**
 * Constructor for a generalized Dropdown
 * @param {string} id - a unique div id
 * @param {array} itemArr - items to populate the dropdown with
 * @param {string} prompt - the first string shown to the user on the main dropdown button
 * @param {function} updateFunc - a function called when an element in the dropdown is selected.
 *  Is passed the text of the selected element, as well as the main button to be updated accordingly
 */
function Dropdown(id, itemArr, prompt,updateFunc) {

  var COMPONENT_CLASS = "btn-group"
  var BTN_CLASS = "btn btn-default dropdown-toggle"
  var UL_CLASS = "dropdown-menu"

  var dropdown = $("<div/>", {
    "class": COMPONENT_CLASS,
    "id": id
  })

  var mainBtn = $("<button/>", {
    "class": BTN_CLASS,
    "id": "dropdownBtn-" + id,
    "data-toggle": "dropdown",
    "text": prompt
  }).append($('<span/>', {"class": "caret"}));

  mainBtn.appendTo(dropdown)

  var mainList = $("<ul/>", {
    "class": UL_CLASS,
    "role": "menu",
    "id": "dropdownUL-" + id
  })

  for (var i = 0; i < itemArr.length; i++) {

    var clickElem = $('<a/>', {
      "text": itemArr[i],
      "class": "choices"
    }).on( "click", function() {
      updateFunc.apply(this, [$(this ).text(),mainBtn])
    });

    mainList.append($("<li/>", {
      }).append(clickElem)
    )
  }
  mainList.appendTo(dropdown)
  return dropdown
}


