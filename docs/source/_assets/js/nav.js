$.when($.ready).then(function() {
  window.history.replaceState({
    'href': window.location.href,
    'title': $(document).filter('title').text(),
    'nav': $(document).find('#nav').html(),
    'content': $(document).find('#content').html()
  }, '', window.location.href)

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

      $('#sidebar').addClass('hidden')
      $('#sidebar-close').addClass('hidden')

      // Update the page
      $('title').text(title)
      $('#nav').html(nav)
      $('#content').html(content)

      // Scroll to the top of the page
      $(document).scrollTop(0)

      // Add page load to browser history
      window.history.pushState({
        'href': href,
        'title': title,
        'nav': $(html).find('#nav').html(),
        'content': $(html).find('#content').html()
      }, '', href)

      // Track on Google Analytics
      if (typeof(ga) === 'function') {
        ga('set', 'page', href)
        ga('send', 'pageview')
      }
    })
  })

  // Load page history (for back/forward nav)
  window.onpopstate = function(e) {
    if(e.state){
      // Update the page
      $('title').text(e.state.title)
      $('#nav').html(e.state.nav)
      $('#content').html(e.state.content)

      // Track on Google Analytics
      if (typeof(ga) === 'function') {
        ga('set', 'page', e.state.href)
        ga('send', 'pageview')
      }
    }
  }

  // Close sidebar (mobile)
  $('#sidebar-close').on('click', function () {
    $('#sidebar').addClass('hidden')
    $('#sidebar-close').addClass('hidden')
  })

  // Show sidebar (mobile)
  $('#sidebar-open').on('click', function () {
      $('#sidebar').removeClass('hidden')
      $('#sidebar-close').removeClass('hidden')
  })
})
