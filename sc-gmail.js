/**
 * jQuery SoundCloud GMail plugin v0.0.1
 * [https://github.com/soundcloud/SoundCloud-Gmail](https://github.com/soundcloud/SoundCloud-Gmail)
 *
 * Copyright 2011, SoundCloud Ltd.
 * Licensed under the MIT license.
 * [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
 *
 */

(function( $ ){
  var reservedUsers = [
    "accounts", "activate", "admin", "announcements", "api", "apps", "artworks", "assets",
    "community-guidelines", "connect", "contacts", "customize", "creativecommons",
    "dashboard", "dropbox",
    "emails", "errors", "events",
    "fans", "faq", "faqs", "feedbacks", "feeds", "followings", "for", "forums",
    "gifts", "groups", "guestlist", "genres",
    "hot",
    "invite", "imprint",
    "logged_exceptions", "latest", "login", "logout",
    "me", "messages", "music",
    "newsletters",
    "oauth", "oauth2", "orders", "oembed",
    "pages", "partners", "people", "player", "playlists", "posts", "press", "pro", "premium", "press_release",
    "robots",
    "search", "session", "sets", "settings", "signup", "stats", "stream", "subscription", "soundcloud",
    "terms-of-use", "tour", "turn_off_notifications", "tags", "topics",
    "upload", "users",
    "videos",
    "waveform", "widgets",
    "widget.xml", "widget", "widget.json",
    "you"
  ],
  reservedTitles = [
    "comments",
    "favorites", "following", "followers",
    "groups",
    "dropbox",
    "sets",
    "tracks"
  ];

  $.fn.scGMail = function( matches, options ) {

    function splitURL(urlPath) {
      return jQuery.grep(urlPath.split('/'), function(element, index){
        return (element.length > 1);
      });
    }

    function matchesSoundcloudUrl(urlPath) {
      var slices = splitURL(urlPath);
      //match sets
      if( slices.length === 3 && slices[1] === 'sets' ) {
          return true;
      }
      //match tracks
      if( slices.length === 2 && jQuery.inArray(slices[0], reservedUsers) === -1 && jQuery.inArray(slices[1], reservedTitles) === -1 ) {
          return true;
      }
      return false;
    }

    function playerCode(url, height) {
      url = encodeURIComponent(url);
      return '<object height="' + height + '" width="100%"> <param name="movie" value="http://player.soundcloud.com/player.swf?url=' + url + '"></param> <param name="allowscriptaccess" value="always"></param> <embed allowscriptaccess="always" height="' + height + '" src="http://player.soundcloud.com/player.swf?url=' + url + '" type="application/x-shockwave-flash" width="100%"></embed></object>';
    }

    /**
     * Merged options `Object` of defaults and plugin param
     *
     * @type Object
     * @param {Function} callback Executed in case of success
     * @param {Number} maxEvents Events to show
     */
    options = $.extend(true, {
      singleHeight: 81,
      setsHeight: 200
    }, options);

    /**
     * Iterates over each collection element
     */
    return this.each(function() {
      var $this = $(this),
          curHeight,
          listSize = 0,
          listHeight = 0;

      // Iterate through the array and display output for each match.
      $.each(matches, function(index, match) {
        if( matchesSoundcloudUrl(match['path']) ) {
          listSize += 1;
          curHeight = (match['path'].search(/\/sets\//) != -1) ? options.setsHeight : options.singleHeight;
          listHeight += curHeight + 10;
          $('<li />').append(playerCode(match['url'], curHeight)).appendTo($this);
        }
      });

      if($.isFunction(options.callback)) {
        options.callback(listSize, listHeight);
      }
    });
  };

})( jQuery );
