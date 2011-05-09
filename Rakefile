require 'rake'

VENDOR_JS_FILES = %w(vendor/jquery-1.6.js vendor/inline-player-0.2.js)

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
  desc "Build the gadget and the xml files"
  task :build do
    in_path   = "chrome-extension"
    out_path  = "build/#{in_path}"
    js_files  = VENDOR_JS_FILES + %W(src/gadget.js #{in_path}/main.js)
    css_files = %w(src/style.css)

    sh <<-END
      mkdir -p #{out_path}
      juicer -q merge -s -f -o #{out_path}/javascripts.js #{js_files.join(' ')}
      juicer -q merge -s -f -o #{out_path}/styles.css #{css_files.join(' ')}
      cp #{in_path}/manifest.json #{out_path}/
      cp assets/logo* #{out_path}/

      zip -r build/chrome-extension.zip build/chrome-extension/
    END
  end
end


namespace 'firefox' do
  desc "Build the gadget and the xml files"
  task :build do
    in_path   = "firefox-extension"
    out_path  = "build/#{in_path}"
    js_files  = VENDOR_JS_FILES + %W(src/gadget.js #{in_path}/main.js)
    css_files = %w(src/style.css)

    sh <<-END
      mkdir -p #{out_path}/lib
      mkdir -p #{out_path}/data
      juicer -q merge -s -f -o #{out_path}/data/javascripts.js #{js_files.join(' ')}
      juicer -q merge -s -f -o #{out_path}/data/styles.css #{css_files.join(' ')}
      cp #{in_path}/main.js #{out_path}/lib
      cp #{in_path}/package.json #{out_path}/
      cp assets/logo-48.png #{out_path}/icon.png
    END
  end

  task :env => :build do
    sh <<-END
      cd /Applications/addon-sdk
      source bin/activate
      cd -
    END
  end

  task :release => :env do
    sh 'cd build/firefox-extension && cfx xpi'
  end

  task :test => :env do
    sh 'cd build/firefox-extension && cfx test'
  end

  task :run => :env do
    sh 'cd build/firefox-extension && cfx run'
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

desc "Build all"
task :build_all => :clean do
  Rake::Task["google-app:build"].execute
  Rake::Task["chrome:build"].execute
  Rake::Task["firefox:build"].execute
end

task :clean do
  sh <<-END
    rm -rf build live gadget.*
  END
end

desc "Deploys gadget to live branch"
task :release => :build do
  unless `git branch` =~ /^\* master$/
    puts "You must be on the master branch to release!"
    exit!
  end
  version = File.open('VERSION').read

  if `git fetch --tags && git tag`.split(/\n/).include?(version)
    raise "Version #{version} already deployed"
  end

  sh <<-END
    git checkout --track -b live origin/live
    git checkout live
    mv -f live/* .
    git commit -a --allow-empty -m 'Release #{version}'

    git push origin live
    git push origin --tags
    git checkout master
  END

  Rake::Task["clean"].execute
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