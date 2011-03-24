#
# Small scrip to generate a RegExp to exclude a string without(!) lookahead
#
def exclude(str, lim = nil)
  limiter = lim ? "[^#{lim}]" : "."
  char    = str[0]
  extends = (str.size > 1) ? "(#{exclude(str[1..-1], lim)})?" : "#{limiter}+"
  "([^#{char}]#{limiter}*)|(#{char}#{extends})"
end

#
# cleanup and transform into proper  RegExp
#
def finalize(exp)
  '^' + exp.delete("\n").delete(" ").gsub('/', '\/') + '$'
end

#  Google Gadget Matching RegExp
application_manifest_pattern = <<-EXP
(https?://)?
(
  (
    snd.sc
    /
    [^/]+
  )
  |
  (
    (www\.)?
    soundcloud\.com
    /
    [^/]+
    /
    (
      (
        sets
        /
        [^/]+
      )
      |
      #{exclude('dropbox', '/')}
    )
    (/s-[^/]+)?
  )
)
(/)?
((\\\?|#).*)?
EXP

####################### TEST #############################################

tests = {
  'd'       => %w(dr tr),
  'dr'      => %w(d dro drop t),
  'dropbox' => %w(d dr drop dropb dropboxtes test)
}

tests.each do |key, shoulds|
  exp = finalize(exclude(key, '/') + "/")
  puts "Test #{key} - #{exp}"
  regexp = Regexp.new( exp )
  shoulds.each do |should|
    puts "FAILED: #{should}" unless regexp.match(should + "/")
  end
  puts "FAILED: #{key}" if regexp.match(key + "/")
  puts
end

invalid = %w(http://soundcloud.com/forss/soulhack/fake
http://soundcloud.com/ryan-15-5/random-audio-test/for/9fcf39?utm_campaign=bulk
http://soundcloud.com/?utm_campaign=direct&utm_content=welcome_email
http://support.soundcloud.com/
http://soundcloud.com/username/dropbox
http://support.soundcloud.com/user/track
http://soundcloud.com/help
http://soundcloud.com/101
http://soundcloud.com/tour
http://soundcloud.com/premium)

valid = %w(http://soundcloud.com/forss/soulhack
http://www.soundcloud.com/forss/soulhack
https://www.soundcloud.com/forss/soulhack
HTTP://SOUNDCLOUD.COM/FORSS/SOULHACK
http://soundcloud.com/forss/sets/soulhack
HTTP://SOUNDCLOUD.COM/FORSS/SETS/SOULHACK
http://soundcloud.com/forss/sets/soulhack/
http://soundcloud.com/forss/sets/soulhack/?test=asd
soundcloud.com/forss/sets/soulhack
http://soundcloud.com/username/sets/dropbox
http://soundcloud.com/mightyoaksmusic/driftwood-seat
http://soundcloud.com/mightyoaksmusic/driftwood-seat?test=asd
http://soundcloud.com/ma_remix/mein-lieblings-obst-sind#comment
http://soundcloud.com/jberkel/sitting-on-the-dock-of-the-bay?test=asd&sdf=asd#comment
http://soundcloud.com/hopit/sounds-from-sunday-morning/s-NUtxs
http://soundcloud.com/hopit/3d-record-at-transit-on/s-1ziKa
https://snd.sc/asd
http://snd.sc/asd'
http://snd.sc/asd/
http://snd.sc/asd/?asd=asd
http://snd.sc/asd/?
http://snd.sc/asd/?asd
http://snd.sc/asd/?asd=)

exp = finalize(application_manifest_pattern)
puts "Test Application Manifest Pattern - #{exp}"
regexp = Regexp.new(exp, true)
invalid.each do |should|
  puts "FAILED: #{should}" if regexp.match(should)
end

valid.each do |should|
  puts "FAILED: #{should}" unless regexp.match(should)
end

