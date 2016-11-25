indexModule.
  component('index', {
    templateUrl: 'index/index.template.html',
    controller: function() {
      $('.draggable').on('drop dragdrop',function(event){
          alert('dropped');
          event.preventDefault();
          console.log(event.dataTransfer.files[0].name);
      });
      $('.draggable').on('dragenter',function(event){
          event.preventDefault();
          $(this).html('drop now').css('background','blue');
      })
      $('.draggable').on('dragleave',function(){
          $(this).html('drop here').css('background','red');
      })
      $('.draggable').on('dragover',function(event){
          event.preventDefault();
      })
    }
  });
