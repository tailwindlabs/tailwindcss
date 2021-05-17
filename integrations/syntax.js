// Small helper to allow for css, html and JavaScript highlighting / formatting in most editors.
function syntax(templates) {
  return templates.join('')
}

module.exports = { css: syntax, html: syntax, javascript: syntax }
