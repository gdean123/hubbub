desc "Task for the build machine"

  task :generate_yml do
    system("cp -f config/database.yml.example config/database.yml")
  end

  task :travis do
    ["rake generate_yml", "rake db:migrate", "rake jslint", "rspec spec", "rake jasmine:ci", "rake cucumber"].each do |cmd|
    puts "Starting to run #{cmd}..."
    system("export DISPLAY=:99.0 && bundle exec #{cmd}")
    raise "#{cmd} failed!" unless $?.exitstatus == 0
  end

end