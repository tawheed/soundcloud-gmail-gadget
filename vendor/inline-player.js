/**
 * jQuery SoundCloud Inline Player Plugin v0.2.0
 * [https://github.com/soundcloud/SoundCloud-Gmail](https://github.com/soundcloud/SoundCloud-Gmail)
 *
 * Copyright 2011, SoundCloud Ltd., Tobias Bielohlawek
 * Licensed under the BSD license.
 *
 */

(function( $ ){
  var reservedUsers = [
    '101',
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
    'favorites', 'following', 'follow', 'followers',
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
    filteredUrl : function(url) {
      var path = url.split(/^(https?:\/\/)?(www\.)?soundcloud.com(.+)/i)[3]; //strip host
      if( !path ) { //  it's not a valid URL
        return false;
      }

      var slices = $.map( methods.splitPath(path), function(element, index) {
            return element.toLowerCase();
          });

      if( //match sets
          (slices.length === 3 && slices[1] === 'sets') ||
          //match screct tracks
          (slices.length === 3 && slices[2].indexOf('s-') === 0) ||
          //match tracks
          (slices.length === 2 && $.inArray(slices[0], reservedUsers) === -1 && $.inArray(slices[1], reservedTitles) === -1 )
      ) {
        return 'http://soundcloud.com/' + slices.join('/');
      }
      return false;

    },

    /**
     * Returns SoundCloud player
     */
    playerCode : function(url, height, https) {
      url = encodeURIComponent(url);
      url = (https ? 'https' : 'http') + '://player.soundcloud.com/player.swf?url=' + url;
      return '<object height="' + height + '" width="100%"> \
         <param name="movie" value="' + url + '" /> \
         <param name="allowscriptaccess" value="always" /> \
         <embed allowscriptaccess="always" height="' + height + '" src="' + url + '" type="application/x-shockwave-flash" width="100%" /> \
       </object>';
    },

    /**
     * Main function, iterate over given paths and append a player for valid ones
     */
    init : function( matches, options ) {
      options = $.extend(true, {
        https: false,
        singleHeight: 81,
        setsHeight: 200
      }, options);

      /**
       * Iterates over each collection element
       */
      return this.each(function() {
        var $this = $(this),
            list = {},
            curHeight;

        //add ul element if not present
        $this = $this.is('ul') ? $this : $('<ul />').appendTo($this);

        $.each(matches, function(index, url) {
          url = url.url || url;
          if( url.search('snd.sc') === -1 ) { //whitelist snd.sc URLs
            url = methods.filteredUrl(url);
          }

          if( url && !list[url] ) {
            list[url] = (url.search(/\/sets\//i) !== -1) ? options.setsHeight : options.singleHeight;
            $('<li />').append(methods.playerCode(url, list[url], options.https)).appendTo($this);
          }
        });

        //trigger callback
        if($.isFunction(options.callback)) {
          options.callback(list);
        }
      });
    }

  };

  /**
   * Plugin scope, check if function exits, fallback to main function
   * this is mainly done to be able to test internal functions
   */
  $.fn.inlinePlayer = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.inlinePlayer' );
      return false;
    }
  };

})( jQuery );
