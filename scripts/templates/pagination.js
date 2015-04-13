/**
 * Constructor for a Pagination Element
 * @param {string} id - a unique div id
 * @param {integer} total - The total number of elements to span all pages
 * @param {integer} callLimit - how many elements per page
 */
function Pagination(id,total,callLimit) {

  var COMPONENT_CLASS = "pagination"

  var pagination = $("<ul/>", {
    "class": COMPONENT_CLASS,
    "id": COMPONENT_CLASS+id
  })

  var pageNum=1;
  for (var i = 0; i < total; i=i+callLimit) {

    var clickElem = $('<a/>', {
      "text": pageNum
    }).on( "click", function(data) {
      console.log(data.target.parentNode)
      characterController.goToPage(data.target.text,data.target.parentNode);
    });

    pagination.append($("<li/>", {
        id: "pageBtn"+i
      }).append(clickElem)
    )
    pageNum++;
  }

  $(pagination.children()[0]).addClass('active');

  return pagination
}


