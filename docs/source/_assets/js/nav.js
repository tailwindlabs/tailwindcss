$.when($.ready).then(function() {
  $('#nav').on('click', 'a', function (event) {

    // Allow opening links in new tabs
    if (event.metaKey) {
        return
    }

    // Prevent following link
    event.preventDefault()

    // Get desired link
    var href = $(this).attr('href')

    // Make Ajax request to get the page content
    $.ajax({
      method: 'GET',
      url: href,
      cache: false,
      dataType: 'html',
    }).done(function(html) {

      // Parse the HTML response
      var title = $(html).filter('title').text()
      var nav = $(html).find('#nav').html()
      var content = $(html).find('#content').html()

      $('#sidebar').addClass("hidden");
      $('.js-close-sidebar').addClass("hidden");

      // Update the page
      $('title').text(title)
      $('#nav').html(nav)
      $('#content').html(content)

      // Scroll to the top of the page
      $(document).scrollTop(0)

      // Add page load to brower history
      window.history.pushState({
        "title": title,
        "nav": $(html).find('#nav').html(),
        "content": $(html).find('#content').html()
      }, '', href)
    })
  })

  // Load page history (for back/forward nav)
  window.onpopstate = function(e) {
      if(e.state){

        // Update the page
        $('title').text(e.state.title)
        $('#nav').html(e.state.nav)
        $('#content').html(e.state.content)
      }
  }
})
