Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2,
           '223922275629.apps.googleusercontent.com', 'ITEMTOoG67piKGzmkqMFJ_Mm',
           {:scope          => 'http://www.google.com/base/feeds/',
            :client_options => {:ssl => {:ca_path => "/etc/ssl/certs"}}}
end