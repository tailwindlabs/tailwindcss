# Changes to normalize.css

### 6.0.0 (March 26, 2017)

* Remove all opinionated rules
* Correct document heading comment
* Update `abbr[title]` support

### 5.0.0 (October 3, 2016)

* Add normalized sections not already present from
  https://html.spec.whatwg.org/multipage/.
* Move unsorted rules into their respective sections.
* Update the `summary` style in all browsers.
* Remove `::placeholder` styles due to a bug in Edge.
* More explicitly define font resets on form controls.
* Remove the `optgroup` normalization needed by the previous font reset.
* Update text-size-adjust documentation  for IE on Windows Phone
* Update OS X reference to macOS
* Update the semver strategy.

### 4.2.0 (June 30, 2016)

* Correct the `line-height` in all browsers.
* Restore `optgroup` font inheritance.
* Update normalize.css heading.

### 4.1.1 (April 12, 2016)

* Update normalize.css heading.

### 4.1.0 (April 11, 2016)

* Normalize placeholders in Chrome, Edge, and Safari.
* Normalize `text-decoration-skip` property in Safari.
* Normalize file select buttons.
* Normalize search input outlines in Safari.
* Limit Firefox focus normalizations to buttons.
* Restore `main` to package.json.
* Restore proper overflow to certain `select` elements.
* Remove opinionated cursor styles on buttons.
* Update stylelint configuration.
* Update tests.

### 4.0.0 (March 19, 2016)

* Add the correct font weight for `b` and `strong` in Chrome, Edge, and Safari.
* Correct inconsistent `overflow` for `hr` in Edge and IE.
* Correct inconsistent `box-sizing` for `hr` in Firefox.
* Correct inconsistent `text-decoration` and `border-bottom` for `abbr[title]`
  in Chrome, Edge, Firefox IE, Opera, and Safari.
* Correct inheritance and scaling of `font-size` for preformatted text.
* Correct `legend` text wrapping not present in Edge and IE.
* Remove unnecessary normalization of `line-height` for `input`.
* Remove unnecessary normalization of `color` for form controls.
* Remove unnecessary `box-sizing` for `input[type="search"]` in Chrome, Edge,
  Firefox, IE, and Safari.
* Remove opinionated table resets.
* Remove opinionated `pre` overflow.
* Remove selector weight from some input selectors.
* Update normalization of `border-style` for `img`.
* Update normalization of `color` inheritance for `legend`.
* Update normalization of `background-color` for `mark`.
* Update normalization of `outline` for `:-moz-focusring` removed by a previous
  normalization in Firefox.
* Update opinionated style of `outline-width` for `a:active` and `a:hover`.
* Update comments to identify opinionated styles.
* Update comments to specify browser/versions affected by all changes.
* Update comments to use one voice.

---

### 3.0.3 (March 30, 2015)

* Remove unnecessary vendor prefixes.
* Add `main` property.

### 3.0.2 (October 4, 2014)

* Only alter `background-color` of links in IE 10.
* Add `menu` element to HTML5 display definitions.

### 3.0.1 (March 27, 2014)

* Add package.json for npm support.

### 3.0.0 (January 28, 2014)

### 3.0.0-rc.1 (January 26, 2014)

* Explicit tests for each normalization.
* Fix i18n for `q` element.
* Fix `pre` text formatting and overflow.
* Fix vertical alignment of `progress`.
* Address `button` overflow in IE 8/9/10.
* Revert `textarea` alignment modification.
* Fix number input button cursor in Chrome on OS X.
* Remove `a:focus` outline normalization.
* Fix `figure` margin normalization.
* Normalize `optgroup`.
* Remove default table cell padding.
* Set correct display for `progress` in IE 8/9.
* Fix `font` and `color` inheritance for forms.

---

### 2.1.3 (August 26, 2013)

* Fix component.json.
* Remove the gray background color from active links in IE 10.

### 2.1.2 (May 11, 2013)

* Revert root `color` and `background` normalizations.

### 2.1.1 (April 8, 2013)

* Normalize root `color` and `background` to counter the effects of system
  color schemes.

### 2.1.0 (January 21, 2013)

* Normalize `text-transform` for `button` and `select`.
* Normalize `h1` margin when within HTML5 sectioning elements.
* Normalize `hr` element.
* Remove unnecessary `pre` styles.
* Add `main` element to HTML5 display definitions.
* Fix cursor style for disabled button `input`.

### 2.0.1 (August 20, 2012)

* Remove stray IE 6/7 `inline-block` hack from HTML5 display settings.

### 2.0.0 (August 19, 2012)

* Remove legacy browser form normalizations.
* Remove all list normalizations.
* Add `quotes` normalizations.
* Remove all heading normalizations except `h1` font size.
* Form elements automatically inherit `font-family` from ancestor.
* Drop support for IE 6/7, Firefox < 4, and Safari < 5.

---

### 1.0.1 (August 19, 2012)

* Adjust `small` font size normalization.

### 1.0.0 (August 14, 2012)

(Only the notable changes since public release)

* Add MIT License.
* Hide `audio` elements without controls in iOS 5.
* Normalize heading margins and font size.
* Move font-family normalization from `body` to `html`.
* Remove scrollbar normalization.
* Remove excess padding from checkbox and radio inputs in IE 7.
* Add IE9 correction for SVG overflow.
* Add fix for legend not inheriting color in IE 6/7/8/9.
