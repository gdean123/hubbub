Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, 'hubbub-dev.heroku.com', 'VVADDlSl481WP-TD_Nx_GOP3', :scope => 'http://www.google.com/base/feeds/'
end