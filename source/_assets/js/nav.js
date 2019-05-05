import nprogress from 'nprogress'

$.when($.ready).then(function() {
  window.history.replaceState({
    'href': window.location.href,
    'title': $('head').filter('title').text(),
    'header': $(document).find('#header').html(),
    'nav': $(document).find('#nav').html(),
    'navClasses': $(document).find('#nav').attr('class'),
    'navGradientClasses': $(document).find('#navGradient').attr('class'),
    'navWrapperClasses': $(document).find('#navWrapper').attr('class'),
    'content': $(document).find('#content').html()
  }, '', window.location.href)

  $('#nav').on('click', 'a', function (event) {
    // Allow opening links in new tabs
    if (event.metaKey) {
      return
    }

    // Start progress
    let progress = setTimeout(() => nprogress.start(), 100)

    // Prevent following link
    event.preventDefault()

    // Get desired link
    var href = $(this).attr('href')

    // Make Ajax request to get the page content
    $.get(href, html => {
      // Parse the HTML response
      var title = $(html).filter('title').text()
      var header = $(html).find('#header').html()
      var nav = $(html).find('#nav').html()
      var navClasses = $(html).find('#nav').attr('class')
      var navGradientClasses = $(html).find('#navGradient').attr('class')
      var navWrapperClasses = $(html).find('#navWrapper').attr('class')
      var content = $(html).find('#content').html()

      $('#sidebar').addClass('hidden')
      $('#sidebar-close').addClass('hidden')
      $('#sidebar-open').removeClass('hidden')
      $('#content-wrapper').removeClass('overflow-hidden max-h-screen fixed')

      // Update the page
      $('head title').text(title)
      $('#header').html(header)
      $('#nav').html(nav)
      $('#nav').attr('class', navClasses)
      $('#navGradient').attr('class', navGradientClasses)
      $('#navWrapper').attr('class', navWrapperClasses)
      $('#content').html(content)

      // Scroll to the top of the page
      $(document).scrollTop(0)

      // Add page load to browser history
      window.history.pushState({
        'href': href,
        'title': title,
        'header': $(html).find('#header').html(),
        'nav': $(html).find('#nav').html(),
        'navClasses': $(html).find('#nav').attr('class'),
        'navGradientClasses': $(html).find('#navGradient').attr('class'),
        'navWrapperClasses': $(html).find('#navWrapper').attr('class'),
        'content': $(html).find('#content').html()
      }, '', href)

      // Clear progress
      nprogress.done()
      clearInterval(progress)

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
      $('#header').html(e.state.header)
      $('#nav').html(e.state.nav)
      $('#nav').attr('class', e.state.navClasses)
      $('#navGradient').attr('class', e.state.navGradientClasses)
      $('#navWrapper').attr('class', e.state.navWrapperClasses)
      $('#content').html(e.state.content)

      // Track on Google Analytics
      if (typeof(ga) === 'function') {
        ga('set', 'page', e.state.href)
        ga('send', 'pageview')
      }
    }
  }

  // Close sidebar (mobile)
  $(document).on('click', '#sidebar-close', function () {
    $('#sidebar').addClass('hidden')
    $('#sidebar-close').addClass('hidden')
    $('#sidebar-open').removeClass('hidden')
    $('#content-wrapper').removeClass('overflow-hidden max-h-screen fixed')
  })

  // Show sidebar (mobile)
  $(document).on('click', '#sidebar-open', function () {
      $('#sidebar-open').addClass('hidden')
      $('#sidebar').removeClass('hidden')
      $('#sidebar-close').removeClass('hidden')
      $('#content-wrapper').addClass('overflow-hidden max-h-screen fixed')
  })
})
