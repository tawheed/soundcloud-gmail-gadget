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

/**
 * Google API Mocks
 */
google = {
  contentmatch : {
    getContentMatches : function() {
      var url = jQuery.url.setUrl(document.location.href);
      return createMatches(url.param("urls").split(','));
    }
  }
};

gadgets = {
  window : {
    adjustHeight : function(height) {
      console.log(height);
    }
  }
};