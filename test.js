
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

  module("Application Manifest URL matching");

  var applicationManifestPattern = /https?:\/\/(www\.)?soundcloud.com\/([^\/]+)\/(sets\/)?([^\/]+)(\/)?(\?.+)?(#.+)?$/i;

  test("should match valid URLS", function() {
    $.each(validUrls, function(index, url) {
      ok( applicationManifestPattern.test(url), "Valid URL: " + url );
    });
  });

  test("should match blacklisted URLS", function() {
    $.each(blacklistedUrls, function(index, url) {
      ok( applicationManifestPattern.test(url), "Blacklisted URL: " + url );
    });
  });

  test("should not match invalid URLS", function() {
    $.each(invalidUrls, function(index, url) {
      ok( !applicationManifestPattern.test(url), "Invalid URL: " + url );
    });
  });

  module("jQuery.scGMail#splitPath");
  test("should filter path", function() {
    validPaths = {
      '/forss/sets/soulhack/?test=asd' : ["forss", "sets", "soulhack"],
      'forss/sets' : ["forss", "sets"],
      'forss/sets/' : ["forss", "sets"],
      'forss/sets#asd' : ["forss", "sets"],
      'forss/sets/?asd=sdf#asd' : ["forss", "sets"]
    };

    $.each(validPaths, function(path, should) {
      is = jQuery('<ul/>').scGMail('splitPath', path);
      same( should, is, "We expect " + path + " to be " + should );
    });
  });

  module("jQuery.scGMail#splitPath");
  test("should filter path", function() {
    validPaths = {
      '/forss/sets/soulhack/?test=asd' : ["forss", "sets", "soulhack"],
      'forss/sets' : ["forss", "sets"],
      'forss/sets/' : ["forss", "sets"],
      'forss/sets#asd' : ["forss", "sets"],
      'forss/sets/?asd=sdf#asd' : ["forss", "sets"]
    };

    $.each(validPaths, function(path, should) {
      is = jQuery('<ul/>').scGMail('splitPath', path);
      same( should, is, "We expect " + path + " to be " + should );
    });
  });

  module("jQuery.scGMail#blacklistedSoundcloudPath");
  test("should not filter valid URLS", function() {
    $.each(validUrls, function(index, url) {
      blacklisted = jQuery('<ul/>').scGMail('blacklistedSoundcloudPath', extractPath(url));
      ok( !blacklisted, "Valid URL: " + url );
    });
  });

  test("should filter blacklisted URLS", function() {
    $.each(blacklistedUrls, function(index, url) {
      blacklisted = jQuery('<ul/>').scGMail('blacklistedSoundcloudPath', extractPath(url));
      ok( blacklisted, "Blacklisted URL: " + url );
    });
  });



  function extractPath(url) {
    host = 'soundcloud.com';
    return url.substr(url.toLowerCase().indexOf(host) + host.length);
  }
});
