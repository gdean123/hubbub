source 'http://rubygems.org'

gem 'rails', '3.0.12'
gem 'heroku'
gem 'jquery-rails'
gem 'omniauth'
gem 'omniauth-google-oauth2'
gem 'pg'

# Gems used only for assets and not required
# in production environments by default.

group :development do
  gem 'ruby-debug-base19x', '0.11.30.pre3'
	gem 'ruby-debug-ide', '0.4.17.beta8'

	platforms :mswin, :mingw do
		gem 'win32console'
	end
end

group :development, :test do
  gem 'factory_girl_rails'
  gem 'rspec-rails'
  gem 'jasmine'
  gem 'capybara'
  gem 'selenium-webdriver', '2.24.0'
  gem 'database_cleaner'

  gem 'jslint_on_rails'

	gem 'simplecov', :require => false

end

group :test do
  gem 'turn', '0.8.2', :require => false
	gem 'cucumber-rails', :require => false
end

