/*!
 * SoundCloud Gmail Gadget
 * [https://github.com/soundcloudlabs/soundcloud-gmail-gadget](https://github.com/soundcloudlabs/soundcloud-gmail-gadget)
 *
 * Copyright 2011, SoundCloud Ltd., Tobias Bielohlawek
 * Licensed under the BSD license.
 *
 */
gadget = function ($, styleUrl) {
  // only act in Conent Frame
  if (!window.frameElement || window.frameElement.id !== 'canvas_frame') {
    return;
  }

  // attach styling
  $('<link rel="stylesheet" type="text/css" />').attr('href', styleUrl).appendTo($('head'));

  var regexpURL =/(https?:\/\/)?(snd.sc\/[^\/]+|(www.)?soundcloud.com\/)[^ <'"\n]+/ig,
  locked = false,

  /**
   * Attach the gadget
   */
  attachGadget = function ($player) {
    $player
    .append( $('<div class="sc-gadget"><div class="head"><b>SoundCloud</b> - Sounds from this email</div><div class="body"><a href="" class="show">Show more</a><a href="">Hide</a></div></div>') )
    .find('.sc-gadget .body').inlinePlayer( matches,
      { https: true,
        callback: function (list) {
          var cnt = $player.find('li').length;
          $player.find('li').css('margin-left', 0).slice(0,3).show();
          if( cnt > 3 ) {
            $player.find('a').click( function(e) {
                $player.find('li').slice(3).add($player.find('a')).toggle();
                return false;
            })
           .filter('.show')
           .html('Show ' + (cnt - 3) + ' more')
           .show();
          }
        }
      }
    );
  },

  /**
   * Find urls and kick off attach process
   */
  init = function () {
    $('.ii.gt:not(.sc-checked)').each(function () {
      if( (matches = $(this).addClass('.sc-checked').html().match(regexpURL)) && matches.length > 0 ) {
        $(this).parent().parent().find('.hi:first:empty').each( function () {
          attachGadget($(this));
        });
      }
    });
  },

  /**
   * Remove gadget in case the gmail gadget is loaded as well.
   */
  removeDuplicate = function () {
    $('.hi div:not(.sc-gadget)').parent().find('.sc-gadget').hide();
  };

  $(document).bind('DOMSubtreeModified', function () {
    //we need to lock here, otherwise it'll triggered by our own changes
    if(!locked) {
      locked = true;
      init();
      removeDuplicate();
      locked = false;
    }
  });

};
