/**
 * Helper functions to perpare fictures
 */
function extractPath(url) {
  return jQuery.url.setUrl(url).attr("relative");
}

function createMatches(urls) {
  return $.map(urls, function(url, index) {
    url = jQuery.url.setUrl(url);
    return { 
      path : url.attr("relative"), 
      url  : url.attr("source"), 
      host : url.attr("protocol") + '://' + url.attr("host") 
    };
  });
}