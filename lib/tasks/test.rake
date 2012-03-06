desc "Run all tests"
task :default => ["jslint", "spec", "jasmine:ci", "cucumber"]
