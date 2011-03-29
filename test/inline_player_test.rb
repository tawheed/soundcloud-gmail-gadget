require 'firewatir'
require "test/unit"
require File.expand_path( File.join( File.dirname( __FILE__ ), '../lib/application_manifest_pattern') )

class InlinePlayerTest < Test::Unit::TestCase
  
  def test_inline_player
    ff = FireWatir::Firefox.new
    path = File.expand_path( File.join( File.dirname( __FILE__ ), 'js/test.html') )
    ff.goto("file://#{path}")
    output = ff.html
    ff.close
    
    assert !output.include?('class="fail"'), "QUnit Test failed"
  end
end