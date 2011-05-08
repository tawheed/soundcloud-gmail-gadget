require 'rake'

namespace 'google-app' do
  JS_FILES = %w(vendor/jquery-1.5.2.js vendor/inline-player.js vendor/inline-player.js google-app/gadget.js)

  def build_gadget(js_files = nil, css_files = nil)
    js_files  ||= JS_FILES
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

  desc "Build the gadget and the xml files"
  task :build => :clean do
    build_gadget

    sh <<-END
      mkdir build/google-app
      erubis -E DeleteIndent,PrintOut -l ruby google-app/application-manifest.xml.erb | ruby > build/google-app/application-manifest.xml

      echo "@gadget = File.open('gadget.html').read" >> gadget.rb
      erubis -E PrintOut -l ruby google-app/gadget.xml.erb >> gadget.rb
      ruby gadget.rb > build/google-app/gadget.xml

      rm -f gadget.rb gadget.html
    END
  end


  desc "Build the gadget file"
  task :build_gadget => :clean do
    build_gadget(JS_FILES << 'google-app/test-wrapper.js')

    puts <<-END
      \n\nRun with:
      open gadget.html?urls=http://soundcloud.com/max-quintenzirkus/max-quintenzirkus-bounce-1\n
    END
  end
end


namespace 'chrome' do
  desc "Build the gadget and the xml files"
  task :build do
    sh <<-END
      zip -r soundcloud-gmail.zip src/
    END
  end
end


namespace 'firefox' do
  desc "Build the gadget and the xml files"
  task :build do
    sh <<-END
      cfx xpi
    END
  end
end


desc "Build all"
task :build_all do
  Rake::Task["google-app:build"].execute
  Rake::Task["chrome:build"].execute
  Rake::Task["firefox:build"].execute
end




task :clean do
  sh <<-END
    rm -rf live gadget.*
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