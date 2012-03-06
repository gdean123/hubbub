source 'http://rubygems.org'

gem 'rails', '3.0.12'
gem 'pg'
gem 'heroku'
gem 'jquery-rails'

# Required on Windows
gem "rake", "0.8.7"
gem 'ffi', '1.0.9'

# Gems used only for assets and not required
# in production environments by default.

group :development do
  gem 'ruby-debug-base19x'
	gem 'ruby-debug-ide'

	platforms :mswin, :mingw do
		gem 'win32console'
	end

#	gem 'guard'
#  gem 'guard-coffeescript'
#  gem 'guard-rspec'
#	gem 'guard-jslint-on-rails'
#	gem 'ruby_gntp'
end

group :development, :test do
  gem 'factory_girl_rails'
  gem 'rspec-rails'
  gem 'jasmine'
  gem 'capybara'
  gem 'selenium-webdriver'
  gem 'cucumber-rails'
  gem 'database_cleaner'

  gem 'jslint_on_rails'

	gem 'simplecov', :require => false

end

group :test do
  gem 'turn', '0.8.2', :require => false
end
