require 'rake'

def build_gadget(js_files = nil, css_files = nil)
  js_files  ||= %w(src/sc-gmail/inline-player.js src/sc-gmail/behavior.js)
  css_files ||= %w(src/sc-gmail/styles.css)

  sh <<-END
    juicer -q merge -s -f -o sc-gmail.js #{js_files.join(' ')}
    echo "@javascripts = File.open('sc-gmail.js').read" >> sc-gmail.rb

    juicer -q merge -s -f -o sc-gmail.css #{css_files.join(' ')}
    echo "@styles = File.open('sc-gmail.css').read" >> sc-gmail.rb

    erubis -E PrintOut -l ruby src/sc-gmail/gadget.html.erb  >> sc-gmail.rb
    ruby sc-gmail.rb > sc-gmail.html

    rm -f sc-gmail.css sc-gmail.js sc-gmail.rb
  END
end

desc "Build the gadget and the xml files"
task :build => :clean do
  build_gadget

  sh <<-END
    mkdir live
    erubis -E DeleteIndent,PrintOut -l ruby src/application-manifest.xml.erb | ruby > live/application-manifest.xml

    echo "@gadget = File.open('sc-gmail.html').read" >> sc-gmail.rb
    erubis -E PrintOut -l ruby src/sc-gmail.xml.erb  >> sc-gmail.rb
    ruby sc-gmail.rb > live/sc-gmail-gadget.xml

    rm -f sc-gmail.rb sc-gmail.html
  END
end


desc "Build the gadget file"
task :build_gadget => :clean do
  js_files = %w(src/sc-gmail/inline-player.js src/sc-gmail/behavior.js test/jQuery-URL-Parser/jquery.url.js test/test-helper.js)
  build_gadget js_files

  puts <<-END
    \n\nRun with:
    open sc-gmail.html?urls=http://soundcloud.com/max-quintenzirkus/max-quintenzirkus-bounce-1\n
  END
end

task :clean do
  sh <<-END
    rm -rf live sc-gmail.*
  END
end

require 'rake/testtask'
Rake::TestTask.new(:test) do |t|
  t.libs << 'lib' << 'test' << Rake.original_dir
  t.pattern = 'test/**/*_test.rb'
  t.verbose = false
end

task :default => :test

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
end