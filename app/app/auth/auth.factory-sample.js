authModule.
  factory('authInfo', function() {
    return {
      options: {
        client_id: 'CLIENT_ID',
        client_secret: 'CLIENT_SECRET',
        redirect_uri: 'REDIRECT_URI'
        scopes: 'basic', //Это значение оставить, остальные заполнить своими значениями.
      },
      code: '', //Сюда ничего не вписывать
    }
});
