indexModule.
  component('index', {
    templateUrl: 'index/index.template.html',
    controller: function(windowTitle, $http, userinfo) {
      var self = this;
      self.title = windowTitle;
      self.title.name = 'MyShows Scrobbler';
      self.username = 'Wait...';


      // $('.draggable').on('drop dragdrop',function(event){
      //     alert('dropped');
      //     event.preventDefault();
      //     console.log(event.dataTransfer.files);
      // });
      // $('.draggable').on('dragenter',function(event){
      //     event.preventDefault();
      //     $(this).html('drop now').css('background','blue');
      // })
      // $('.draggable').on('dragleave',function(){
      //     $(this).html('drop here').css('background','red');
      // })
      $(document).on('test', function() {self.username = userinfo.login()});
      if (userinfo.login() !== null) {
        self.username = userinfo.login();
      }


    (function () {
        var holder = document.querySelector('.draggable');

        holder.ondragover = () => {
            return false;
        };

        holder.ondragleave = () => {
            return false;
        };

        holder.ondragend = () => {
            return false;
        };

        holder.ondrop = (e) => {
            e.preventDefault();

            for (let f of e.dataTransfer.files) {
                console.log('File(s) you dragged here: ', f.name)
            }

            return false;
        };
    })();

    }
  });
