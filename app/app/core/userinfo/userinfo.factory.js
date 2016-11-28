userinfoModule.
  factory('userinfo', function(msrequest) {
    var self = this, userInfo = {};
    self.msrequest = msrequest;


    if (!localStorage.getItem('userInfo')) {
      userInfo = self.msrequest.get('profile.Get').then(function(response) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.result.user));
        userInfo = response.data.result.user
        $(document).trigger('test');
      });
    } else userInfo = JSON.parse(localStorage.getItem('userInfo'));

    return {
      data: userInfo,
      login: function() {
        if (localStorage.getItem('userInfo')) return JSON.parse(localStorage.getItem('userInfo')).login;
        else return null;
      }
    }
});
