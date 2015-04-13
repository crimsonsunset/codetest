/**
 * Function that returns a spinner object
 * @param {element} spinnerHolder - a div that will house the spinner
 */
function createSpinner(spinnerHolder) {

  if (spinnerHolder.children().length ==0) {
    var currSpinner = $("<div/>", {
      "class": "spinner"
    })
    spinnerHolder.append(currSpinner)
    return currSpinner

  } else {
    return null

  }


}
