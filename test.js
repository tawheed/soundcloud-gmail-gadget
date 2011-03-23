
$(document).ready(function(){

  var validUrls = [
        'http://soundcloud.com/forss/soulhack',
        'http://www.soundcloud.com/forss/soulhack',
        'https://www.soundcloud.com/forss/soulhack',
        'HTTP://SOUNDCLOUD.COM/FORSS/SOULHACK',
        'http://soundcloud.com/forss/sets/soulhack',
        'HTTP://SOUNDCLOUD.COM/FORSS/SETS/SOULHACK',
        'http://soundcloud.com/forss/sets/soulhack/',
        'http://soundcloud.com/forss/sets/soulhack/?test=asd',
        'http://soundcloud.com/forss/sets/soulhack',
        'http://soundcloud.com/mightyoaksmusic/driftwood-seat?test=asd',
        'http://soundcloud.com/ma_remix/mein-lieblings-obst-sind#comment',
        'http://soundcloud.com/jberkel/sitting-on-the-dock-of-the-bay?test=asd&sdf=asd#comment'
        ],
      blacklistedUrls = [
        'http://soundcloud.com/forss/dropbox',
        'http://soundcloud.com/pages/support?utm_campaign=direct&utm_content=welcome_email&utm_medium=notification&utm_source=soundcloud&utm_term=20101025',
        'http://soundcloud.com/emails/1aa8eebcf?utm_campaign=direct&utm_content=welcome_email&utm_medium=notification&utm_source=soundcloud&utm_term=20101025',
        'http://soundcloud.com/username/comments',
        'http://soundcloud.com/username/favorites',
        'http://soundcloud.com/username/groups',
        'http://soundcloud.com/username/dropbox',
        'http://soundcloud.com/username/sets',
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
        ],
      invalidUrls = [
        'http://soundcloud.com/forss/soulhack/fake',
        'http://soundcloud.com/?utm_campaign=direct&utm_content=welcome_email&utm_medium=notification&utm_source=soundcloud&utm_term=20101025',
        'http://support.soundcloud.com/',
        'http://support.soundcloud.com/user/track',
        'http://soundcloud.com/help',
        'http://soundcloud.com/101',
        'http://soundcloud.com/tour',
        'http://soundcloud.com/premium'
        ];

  module("Application Manifest");

  var applicationManifestPattern = /https?:\/\/(www\.)?soundcloud.com\/([^\/]+)\/(sets\/)?([^\/]+)(\/)?(\?.+)?(#.+)?$/i;

  test("match URLS", 41, function() {
    $.each(validUrls, function(index, url) {
      ok( applicationManifestPattern.test(url), "We expect url to be valid: " + url );
    });

    $.each(blacklistedUrls, function(index, url) {
      ok( applicationManifestPattern.test(url), "We expect url to be valid: " + url );
    });

    $.each(invalidUrls, function(index, url) {
      ok( !applicationManifestPattern.test(url), "We expect url to be invalid: " + url );
    });
  });

  module('jQuery.scGMail');
  test("splitPath: split path", 7, function() {
    validPaths = {
      '/forss/sets/soulhack/?test=asd' : ["forss", "sets", "soulhack"],
      'forss/sets' : ["forss", "sets"],
      'forss/sets/' : ["forss", "sets"],
      'forss/' : ["forss"],
      'forss/sets#asd' : ["forss", "sets"],
      'FORSS/SETS#ASD' : ["FORSS", "SETS"],
      'forss/sets/?asd=sdf#asd' : ["forss", "sets"]
    };

    $.each(validPaths, function(path, should) {
      var is = jQuery('<ul/>').scGMail('splitPath', path);
      deepEqual( should, is, "We expect " + path + " to be " + should );
    });
  });

  test("filteredPath: filter path", 33, function() {
    $.each(validUrls, function(index, url) {
      var cleaned = jQuery('<ul/>').scGMail('filteredPath', extractPath(url));
      ok( cleaned, "We expect path not to be filtered: " + url );
    });

    $.each(blacklistedUrls, function(index, url) {
      var cleaned = jQuery('<ul/>').scGMail('filteredPath', extractPath(url));
      ok( !cleaned, "We expect path to be filtered: " + url );
    });
  });

  test("inital dom node", 6, function() {
    var $node = jQuery('<div/>').scGMail(createMatches(validUrls), { callback : function(listSize, listHeight) {
      equal( 5, listSize, "We expect list to be " + listSize );
    }});
    equal( $node.find('ul').length, 1, "We expect UL to be added" );
    equal( $node.find('ul li').length, 5, "We expect li to be added to ul" );
    equal( $node.find('ul li:first-child object').length, 1, "We expect object to be added to li" );
    equal( $node.find('ul li:first-child object param').length, 2, "We expect param to be added to object" );
    equal( $node.find('ul li:first-child object embed').length, 1, "We expect embed to be added to object" );
  });

  /**
   * Helper functions to perpare fictures
   */
  function extractPath(url) {
    host = 'soundcloud.com';
    return url.substr(url.toLowerCase().indexOf(host) + host.length);
  }

  function createMatches(urls) {
    return $.map(urls, function(url, index) {
      return { path : extractPath(url) };
    });
  }
});
