authModule.
  factory('authInfo', function() {
    return {
      options: {
        client_id: 'myshows_scrobbler',
        client_secret: 'SAlxyOdm4vPrlXSasbr1KTB8',
        scopes: 'basic',
        redirect_uri: 'myshows://oauth-callback/myshows'
      },
      code: '',
    }
});
