#
# Small scrip to generate a RegExp to exclude a string without(!) lookahead
#

class ApplicationManifestPattern

  class << self
    #  Google Gadget Matching RegExp
    def get( ex = 'dropbox' )
      finalize <<-EXP
        (https?://)?
        (
          snd.sc/[^/]+
        |
          (www\.)?
          soundcloud\.com/
          [^/]+/
          (
            sets/
            [^/]+
          |
            #{exclude( ex, '/')}
          )
          (/s-[^/]+)?
        )
        (/)?
        ((\\\?|#).*)?
      EXP
    end

    def exclude(str, lim = nil)
      limiter = lim ? "[^#{lim}]" : "."
      char    = str[0]
      extends = (str.size > 1) ? "(#{exclude(str[1..-1], lim)})?" : "#{limiter}+"
      "[^#{char}]#{limiter}*|#{char}#{extends}"
    end

    #
    # cleanup and transform into proper  RegExp
    #
    def finalize(exp)
      '^' + exp.delete("\n").delete(" ").gsub('/', '\/') + '$'
    end
  end
end
