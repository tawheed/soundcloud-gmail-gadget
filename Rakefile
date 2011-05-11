require 'rake'

VENDOR_JS_FILES = %w(vendor/jquery-1.6.js vendor/inline-player-0.2.js)
TITLE           = "SoundCloud Sounds in Google Mail\\u2122"
VERSION         = File.open('VERSION').read.strip
DESCRIPTION     = "Show SoundCloud waveform players in Google Mail\\u2122 for track links found in emails"

namespace 'google-app' do
  desc "Build the gadget and the xml files"
  task :build do
    build_gadget VENDOR_JS_FILES + %w(google-app/gadget.js)

    sh <<-END
      mkdir build
      mkdir build/google-app
      erubis -E DeleteIndent,PrintOut -l ruby google-app/application-manifest.xml.erb | ruby > build/google-app/application-manifest.xml

      echo "@gadget = File.open('gadget.html').read" >> gadget.rb
      erubis -E PrintOut -l ruby google-app/gadget.xml.erb >> gadget.rb
      ruby gadget.rb > build/google-app/gadget.xml

      rm -f gadget.rb gadget.html
    END
  end
end


namespace 'chrome' do
  in_path   = "chrome-extension"
  out_path  = "build/#{in_path}"
  js_files  = VENDOR_JS_FILES + %W(src/gadget.js #{in_path}/main.js)
  css_files = %w(src/style.css)

  desc "Build the gadget and the xml files"
  task :build do
    sh <<-END
      mkdir -p #{out_path}
      juicer -q merge -s -f -o #{out_path}/javascripts.js #{js_files.join(' ')}
      juicer -q merge -s -f -o #{out_path}/styles.css #{css_files.join(' ')}
      echo "@title = '#{TITLE}';@version = '#{VERSION}';@description = '#{DESCRIPTION}'" > gadget.rb
      erubis -E PrintOut -l ruby #{in_path}/manifest.json.erb >> gadget.rb
      ruby gadget.rb > #{out_path}/manifest.json
      cp assets/logo* #{out_path}/
      rm -f gadget.rb
    END
  end

  task :release do
    sh "zip -r build/chrome-extension.zip #{out_path}/"
  end
end


namespace 'firefox' do
  in_path   = "firefox-extension"
  out_path  = "build/#{in_path}"
  js_files  = VENDOR_JS_FILES + %W(src/gadget.js #{in_path}/main.js)
  css_files = %w(src/style.css)

  desc "Build the gadget and the xml files"
  task :build do
    sh <<-END
      mkdir -p #{out_path}/lib
      mkdir -p #{out_path}/data
      juicer -q merge -s -f -o #{out_path}/data/javascripts.js #{js_files.join(' ')}
      juicer -q merge -s -f -o #{out_path}/data/styles.css #{css_files.join(' ')}
      echo "@title = '#{TITLE}';@version = '#{VERSION}';@description = '#{DESCRIPTION}'" > gadget.rb
      erubis -E PrintOut -l ruby #{in_path}/package.json.erb >> gadget.rb
      ruby gadget.rb > #{out_path}/package.json
      cp #{in_path}/main.js #{out_path}/lib
      cp assets/logo-48.png #{out_path}/icon.png
      rm -f gadget.rb
    END
  end

  task :release do
    cfx "--pkgdir=#{out_path} xpi"
    sh <<-END
      mv soundcloud-gmail-firefox-extension.xpi build/firefox-extension.xpi
    END
  end

  task :test do
    cfx "--pkgdir=#{out_path} test"
  end

  task :run do
    cfx "--pkgdir=#{out_path} run"
  end
end

namespace 'example' do
  desc "Build the Example file"
  task :build do
    build_gadget VENDOR_JS_FILES + %w(google-app/example.js google-app/gadget.js)

    puts <<-END
      \n\nRun with:
      open gadget.html?urls=http://soundcloud.com/max-quintenzirkus/max-quintenzirkus-bounce-1\n
    END
  end
end

task :clean do
  sh <<-END
    rm -rf build live gadget.*
  END
end

desc "Build all"
task :build_all => :clean do
  Rake::Task["google-app:build"].execute
  Rake::Task["chrome:build"].execute
  Rake::Task["firefox:build"].execute
end

desc "Release all"
task :release_all => :build_all do
  #Rake::Task["google-app:release"].execute - NOTHING to do
  Rake::Task["chrome:release"].execute
  Rake::Task["firefox:release"].execute
end

desc "Deploys gadget to live branch"
task :deploy => :release_all do
  unless `git branch` =~ /^\* master$/
    puts "You must be on the master branch to deploy!"
    exit!
  end

  if `git fetch --tags && git tag`.split(/\n/).include?(VERSION)
    raise "Version #{VERSION} already deployed"
  end

  sh <<-END
    git checkout --track -b gh-pages origin/gh-pages
    git checkout gh-pages
    rm -rf *extension*
    rm -rf google-app
    mv -f build/* .
    git commit -a --allow-empty -m 'Release #{VERSION}'

    git push origin gh-pages
    git push origin --tags
    git checkout master
  END
end

task :default => :build_all

def build_gadget(js_files = nil, css_files = nil)
  css_files ||= %w(google-app/styles.css)

  sh <<-END
    juicer -q merge -s -f -o javascripts.js #{js_files.join(' ')}
    echo "@javascripts = File.open('javascripts.js').read" >> gadget.rb

    juicer -q merge -s -f -o styles.css #{css_files.join(' ')}
    echo "@styles = File.open('styles.css').read" >> gadget.rb

    erubis -E PrintOut -l ruby google-app/gadget.html.erb  >> gadget.rb
    ruby gadget.rb > gadget.html

    rm -f javascripts.js styles.css gadget.rb
  END
end

def cfx(command)
  sh <<-END
    cd /Applications/addon-sdk
    source bin/activate
    cd -
    cfx #{command}
  END
end