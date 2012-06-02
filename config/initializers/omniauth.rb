Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2,
           '223922275629.apps.googleusercontent.com', 'ITEMTOoG67piKGzmkqMFJ_Mm',
           {:scope          => 'https://www.google.com/base/feeds/',
            :access_type    => 'online',
            :approval_prompt => "",
            :client_options => {:ssl => {:ca_path => "/etc/ssl/certs"}}}
end