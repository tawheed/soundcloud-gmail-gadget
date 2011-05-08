require "test/unit"
require File.expand_path( File.join( File.dirname( __FILE__ ), '../lib/application_manifest_pattern') )

class ApplicationManifestPatternTest < Test::Unit::TestCase

  def test_excusion
    {
      'd'       => %w(dr tr),
      'dr'      => %w(d dro drop t),
      'dropbox' => %w(d dr drop dropb dropboxtes test)
    }.each do |key, shoulds|
      exp = ApplicationManifestPattern::finalize(ApplicationManifestPattern::exclude(key, '/') + "/")
      regexp = Regexp.new( exp )
      shoulds.each do |should|
        assert regexp.match(should + "/")
      end
      assert !regexp.match(key + "/")
    end
  end

  def test_invalid
    pattern = ApplicationManifestPattern::get
    regexp = Regexp.new(pattern, true)

    %w(http://soundcloud.com/forss/soulhack/fake
    http://soundcloud.com/ryan-15-5/random-audio-test/for/9fcf39?utm_campaign=bulk
    http://soundcloud.com/?utm_campaign=direct&utm_content=welcome_email
    http://support.soundcloud.com/
    http://soundcloud.com/username/dropbox
    http://support.soundcloud.com/user/track
    http://soundcloud.com/help
    http://soundcloud.com/101
    http://soundcloud.com/tour
    http://soundcloud.com/premium
    ).each do |should|
      assert !regexp.match(should)
    end
  end

  def test_valid
    pattern = ApplicationManifestPattern::get
    regexp = Regexp.new(pattern, true)

    %w(
    http://soundcloud.com/forss/soulhack
    http://www.soundcloud.com/forss/soulhack
    https://www.soundcloud.com/forss/soulhack
    HTTP://SOUNDCLOUD.COM/FORSS/SOULHACK
    http://soundcloud.com/forss/sets/soulhack
    HTTP://SOUNDCLOUD.COM/FORSS/SETS/SOULHACK
    http://soundcloud.com/forss/sets/soulhack/
    http://soundcloud.com/forss/sets/soulhack/?test=asd
    soundcloud.com/forss/sets/soulhack
    http://soundcloud.com/username/sets/dropbox
    http://soundcloud.com/mightyoaksmusic/driftwood-seat?test=asd
    http://soundcloud.com/ma_remix/mein-lieblings-obst-sind#comment
    http://soundcloud.com/jberkel/sitting-on-the-dock-of-the-bay?test=asd&sdf=asd#comment
    http://soundcloud.com/hopit/sounds-from-sunday-morning/s-NUtxs
    http://soundcloud.com/hopit/3d-record-at-transit-on/s-1ziKa'
    https://snd.sc/asd
    http://snd.sc/asd
    http://snd.sc/asd/
    http://snd.sc/asd/?asd=asd
    http://soundcloud.com/pages/support?utm_campaign=direct&utm_content=welcome_email&utm_medium=notification&utm_source=soundcloud&utm_term=20101025
    http://soundcloud.com/emails/1aa8eebcf?utm_campaign=direct&utm_content=welcome_email&utm_medium=notification&utm_source=soundcloud&utm_term=20101025
    http://soundcloud.com/username/comments
    http://soundcloud.com/username/favorites
    http://soundcloud.com/username/groups
    http://soundcloud.com/username/sets
    http://soundcloud.com/username/tracks
    http://soundcloud.com/accounts/trackname
    http://soundcloud.com/dashboard/trackname
    http://soundcloud.com/emails/trackname
    http://soundcloud.com/fans/trackname
    http://soundcloud.com/gifts/trackname
    http://soundcloud.com/hot/trackname
    http://soundcloud.com/invite/trackname
    http://soundcloud.com/me/trackname
    http://soundcloud.com/oauth/trackname
    http://soundcloud.com/pages/trackname
    http://soundcloud.com/robots/trackname
    http://soundcloud.com/search/trackname
    ).each do |should|
      assert regexp.match(should)
    end
  end

end