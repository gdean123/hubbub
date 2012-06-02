Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google, '	hubbub-dev.heroku.com', 'VVADDlSl481WP-TD_Nx_GOP3', :scope => 'https://mail.google.com/mail/feed/atom/'
end