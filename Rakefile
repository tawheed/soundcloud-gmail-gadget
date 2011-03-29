require 'rake'

desc "Build the gadget"
task :build do
  files = %w(src/sc-gmail/inline-player.js src/sc-gmail/behavior.js)

  sh <<-END
    rm -rf live
    mkdir live
    juicer -q merge -s -f -o sc-gmail.js #{files.join(' ')}
    erubis -E DeleteIndent,PrintOut -l ruby src/application-manifest.xml.erb | ruby > live/application-manifest.xml
    echo "@styles = File.open('src/sc-gmail/styles.css').read" > gadget.rb
    echo "@javascripts = File.open('sc-gmail.js').read" >> gadget.rb
    erubis -E PrintOut -l ruby src/sc-gmail/gadget.html.erb  >> gadget.rb
    ruby gadget.rb > sc-gmail.html
    echo "@gadget = File.open('sc-gmail.html').read" > sc-gmail.rb
    erubis -E PrintOut -l ruby src/sc-gmail.xml.erb  >> sc-gmail.rb
    ruby sc-gmail.rb > live/sc-gmail-gadget.xml
    rm -f sc-gmail.js gadget.rb sc-gmail.rb sc-gmail.html
  END
end


desc "Build example"
task :build_example do
  files = %w(src/sc-gmail/inline-player.js src/sc-gmail/behavior.js test/jQuery-URL-Parser/jquery.url.js test/test-helper.js)
  sh <<-END
    rm -f example.html
    juicer -q merge -s -f -o sc-gmail.js #{files.join(' ')}
    echo "@styles = File.open('src/sc-gmail/styles.css').read" > gadget.rb
    echo "@javascripts = File.open('sc-gmail.js').read" >> gadget.rb
    erubis -E PrintOut -l ruby src/sc-gmail/gadget.html.erb  >> gadget.rb
    ruby gadget.rb > example.html
    rm -f sc-gmail.js gadget.rb
  END

  puts <<-END
    \n\nRun with:
    open example.html?urls=http://soundcloud.com/max-quintenzirkus/max-quintenzirkus-bounce-1\n
  END
end

task :clean do
  sh <<-END
    rm -f example.html
    rm -rf live
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
    git checkout live
    mv -f live/* .
    git commit -a --allow-empty -m 'Release #{version}'
    git tag -a #{version} -m 'Version #{version}'
    git push origin live
    git push origin --tags
    git checkout master
  END
end