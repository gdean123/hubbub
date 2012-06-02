Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2,
           "223922275629.apps.googleusercontent.com", "ITEMTOoG67piKGzmkqMFJ_Mm",
           # {:scope          => 'https://www.google.com/base/feeds/',
           {:scope          => "https://www.google.com/base/feeds/",
            :access_type    => "online",
            :approval_prompt => "",
            :redirect_uri => "http://localhost:3000/auth/google_oauth2/callback",
            :client_options => {:ssl => {:ca_path => "/etc/ssl/certs"}}}
end