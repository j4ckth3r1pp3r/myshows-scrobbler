windowTitleModule.
  component('title', {
    template: '{{$ctrl.title.name}}',
    controller: function (windowTitle) {
      this.title = windowTitle;
    }
  });
