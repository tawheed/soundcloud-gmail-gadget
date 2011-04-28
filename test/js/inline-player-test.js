/**
 * qUnit Tests for inlinePlayer Plugin
 */
$(document).ready(function(){

  //Fixtures
  var validUrls = [
        'http://soundcloud.com/forss/soulhack',
        'http://www.soundcloud.com/forss/soulhack',
        'https://www.soundcloud.com/forss/soulhack',
        'HTTP://SOUNDCLOUD.COM/FORSS/SOULHACK',
        'http://soundcloud.com/forss/sets/soulhack',
        'HTTP://SOUNDCLOUD.COM/FORSS/SETS/SOULHACK',
        'http://soundcloud.com/forss/sets/soulhack/',
        'http://soundcloud.com/forss/sets/soulhack/?test=asd',
        'soundcloud.com/forss/sets/soulhack',
        'http://soundcloud.com/username/sets/dropbox',
        'http://soundcloud.com/mightyoaksmusic/driftwood-seat?test=asd',
        'http://soundcloud.com/ma_remix/mein-lieblings-obst-sind#comment',
        'http://soundcloud.com/jberkel/sitting-on-the-dock-of-the-bay?test=asd&sdf=asd#comment',
        'http://soundcloud.com/hopit/sounds-from-sunday-morning/s-NUtxs',
        'http://soundcloud.com/hopit/3d-record-at-transit-on/s-1ziKa'
        ],
      validExternalUrls = [
       'https://snd.sc/asd',
       'http://snd.sc/asd',
       'http://snd.sc/asd/',
       'http://snd.sc/asd/?asd=asd'
      ],
      blacklistedUrls = [
        'http://soundcloud.com/pages/support?utm_campaign=direct&utm_content=welcome_email&utm_medium=notification&utm_source=soundcloud&utm_term=20101025',
        'http://soundcloud.com/emails/1aa8eebcf?utm_campaign=direct&utm_content=welcome_email&utm_medium=notification&utm_source=soundcloud&utm_term=20101025',
        'http://soundcloud.com/username/comments',
        'http://soundcloud.com/username/favorites',
        'http://soundcloud.com/username/groups',
        'http://soundcloud.com/username/sets',
        'http://soundcloud.com/username/follow',
        'http://soundcloud.com/username/tracks',
        'http://soundcloud.com/accounts/trackname',
        'http://soundcloud.com/dashboard/trackname',
        'http://soundcloud.com/emails/trackname',
        'http://soundcloud.com/fans/trackname',
        'http://soundcloud.com/gifts/trackname',
        'http://soundcloud.com/hot/trackname',
        'http://soundcloud.com/invite/trackname',
        'http://soundcloud.com/me/trackname',
        'http://soundcloud.com/oauth/trackname',
        'http://soundcloud.com/pages/trackname',
        'http://soundcloud.com/robots/trackname',
        'http://soundcloud.com/search/trackname'
        ];

  module('jQuery.inlinePlayer');
  test('splitPath: split path', 7, function() {
    validPaths = {
      '/forss/sets/soulhack/?test=asd' : ['forss', 'sets', 'soulhack'],
      'forss/sets' : ['forss', 'sets'],
      'forss/sets/' : ['forss', 'sets'],
      'forss/' : ['forss'],
      'forss/sets#asd' : ['forss', 'sets'],
      'FORSS/SETS#ASD' : ['FORSS', 'SETS'],
      'forss/sets/?asd=sdf#asd' : ['forss', 'sets']
    };

    $.each(validPaths, function(path, should) {
      var is = jQuery('<ul/>').inlinePlayer('splitPath', path);
      deepEqual( should, is, 'We expect ' + path + ' to be ' + should );
    });
  });

  test('filteredUrl: filter path', 35, function() {
    $.each(validUrls, function(index, url) {
      var cleaned = jQuery('<ul/>').inlinePlayer('filteredUrl', extractPath(url));
      ok( cleaned, 'We expect path not to be filtered: ' + url );
    });

    $.each(blacklistedUrls, function(index, url) {
      var cleaned = jQuery('<ul/>').inlinePlayer('filteredUrl', extractPath(url));
      ok( !cleaned, 'We expect path to be filtered: ' + url );
    });
  });

  test('inital dom node', 7, function() {
    var $node = jQuery('<div/>').inlinePlayer(createMatches(validUrls.concat(validExternalUrls)), { callback : function(list) {
      var cnt = 0, maxHeight = 0;
      $.each(list, function(url, height) {
        cnt += 1;
        maxHeight += height;
      });
      equal( 12, cnt, 'We expect list to have ' + cnt + ' elements');
      equal( 1210, maxHeight, 'We expect list to have ' + maxHeight + ' height');
    }});
    equal( $node.find('ul').length, 1, 'We expect UL to be added' );
    equal( $node.find('ul li').length, 12, 'We expect li to be added to ul' );
    equal( $node.find('ul li:first-child object').length, 1, 'We expect object to be added to li' );
    equal( $node.find('ul li:first-child object param').length, 2, 'We expect param to be added to object' );
    equal( $node.find('ul li:first-child object embed').length, 1, 'We expect embed to be added to object' );
  });

});
