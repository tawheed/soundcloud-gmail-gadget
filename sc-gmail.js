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
    'accounts', 'activate', 'admin', 'announcements', 'api', 'apps', 'artworks', 'assets',
    'community-guidelines', 'connect', 'contacts', 'customize', 'creativecommons',
    'dashboard', 'dropbox',
    'emails', 'errors', 'events',
    'fans', 'faq', 'faqs', 'feedbacks', 'feeds', 'followings', 'for', 'forums',
    'gifts', 'groups', 'guestlist', 'genres',
    'hot',
    'invite', 'imprint',
    'logged_exceptions', 'latest', 'login', 'logout',
    'me', 'messages', 'music',
    'newsletters',
    'oauth', 'oauth2', 'orders', 'oembed',
    'pages', 'partners', 'people', 'player', 'playlists', 'posts', 'press', 'pro', 'premium', 'press_release',
    'robots',
    'search', 'session', 'sets', 'settings', 'signup', 'stats', 'stream', 'subscription', 'soundcloud',
    'terms-of-use', 'tour', 'turn_off_notifications', 'tags', 'topics',
    'upload', 'users',
    'videos',
    'waveform', 'widgets',
    'widget.xml', 'widget', 'widget.json',
    'you'
  ],
  reservedTitles = [
    'comments',
    'favorites', 'following', 'followers',
    'groups',
    'dropbox',
    'sets',
    'tracks'
  ],
  methods = {
    /**
     * Split path and remove trailing vars and anchors
     */
    splitPath : function(urlPath) {
      urlPath = urlPath.split('?')[0]; //strip vars
      urlPath = urlPath.split('#')[0]; //strip anchors
      return $.grep(urlPath.split('/'), function(element, index){
        return (element.length > 1);
      });
    },

    /**
     * Filter blacklist or invalid paths
     */
    filteredPath : function(urlPath) {
      var slices = $.map( methods.splitPath(urlPath), function(element, index) {
        return element.toLowerCase();
      });

      //match sets
      if( slices.length === 3 && slices[1] === 'sets' ) {
        return slices.join('/');
      }
      //match tracks
      if( slices.length === 2 && $.inArray(slices[0], reservedUsers) === -1 && $.inArray(slices[1], reservedTitles) === -1 ) {
        return slices.join('/');
      }
      return false;
    },

    /**
     * Returns SoundCloud player
     */
    playerCode : function(path, height) {
      url = encodeURIComponent('http://soundcloud.com' + path);
      return '<object height="' + height + '" width="100%"> \
         <param name="movie" value="http://player.soundcloud.com/player.swf?url=' + url + '"></param> \
         <param name="allowscriptaccess" value="always"></param> \
         <embed allowscriptaccess="always" height="' + height + '" src="http://player.soundcloud.com/player.swf?url=' + url + '" type="application/x-shockwave-flash" width="100%"></embed> \
       </object>';
    },

    /**
     * Main function, iterate over given paths and append a player for valid ones
     */
    init : function( matches, options ) {
      options = $.extend(true, {
        singleHeight: 90,
        setsHeight: 200,
        linePadding: 15
      }, options);

      /**
       * Iterates over each collection element
       */
      return this.each(function() {
        var $this = $(this),
            listSize = 0,
            listHeight = 0,
            list = {},
            curHeight;

        //add ul element if not present
        $this = $this.is('ul') ? $this : $('<ul />').appendTo($this);

        $.each(matches, function(index, match) {
          path = methods.filteredPath(match['path']);
          if( path && !list[path] ) {
            curHeight = (path.search(/\/sets\//i) != -1) ? options.setsHeight : options.singleHeight;
            $('<li />').append(methods.playerCode('/' + path, curHeight)).appendTo($this);
            listSize += 1;
            listHeight += curHeight + options.linePadding;
            list[path] = true;
          }
        });

        //trigger callback
        if($.isFunction(options.callback)) {
          options.callback(listSize, listHeight, list);
        }
      });
    }

  };

  /**
   * Plugin scope, check if function exits, fallback to main function
   * this is mainly done to be able to test internal functions
   */
  $.fn.scGMail = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.scGMail' );
      return false;
    }
  };

})( jQuery );
