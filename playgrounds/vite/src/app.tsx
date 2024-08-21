import { Foo } from './foo'

export function App() {
  return (
    <div>
      <div className="m-3 p-3 border">
        <h1 className="text-blue-500">Hello World</h1>
        <button className="hocus:underline">Click me</button>
        <Foo />
      </div>
      <div className="mt-8 prose prose-slate mx-auto lg:prose-lg">
        <h1>Headline</h1>
        <p className="lead">
          Until now, trying to style an article, document, or blog post with Tailwind has been a
          tedious task that required a keen eye for typography and a lot of complex custom CSS.
        </p>
        <p>
          By default, Tailwind removes all of the default browser styling from paragraphs, headings,
          lists and more. This ends up being really useful for building application UIs because you
          spend less time undoing user-agent styles, but when you <em>really are</em> just trying to
          style some content that came from a rich-text editor in a CMS or a markdown file, it can
          be surprising and unintuitive.
        </p>
        <p>
          We get lots of complaints about it actually, with people regularly asking us things like:
        </p>
        <blockquote>
          <p>
            Why is Tailwind removing the default styles on my <code>h1</code> elements? How do I
            disable this? What do you mean I lose all the other base styles too?
          </p>
        </blockquote>
      </div>
      <div>
        <div class="antialiased text-gray-900 px-6">
          <div class="max-w-xl mx-auto py-12 md:max-w-4xl">
            <h2 class="text-2xl font-bold">Reset styles</h2>
            <p class="mt-2 text-lg text-gray-500">
              These are form elements this plugin styles by default.
            </p>
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div class="grid grid-cols-1 gap-6">
                <label class="block">
                  <span class="text-gray-700">Input (text)</span>
                  <input
                    type="text"
                    class="form-input mt-1 block w-full"
                    placeholder="john@example.com"
                  />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (email)</span>
                  <input
                    type="email"
                    class="form-input mt-1 block w-full"
                    placeholder="john@example.com"
                  />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (email, multiple)</span>
                  <input
                    type="email"
                    multiple
                    class="form-input mt-1 block w-full"
                    placeholder="john@example.com"
                  />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (password)</span>
                  <input
                    type="password"
                    class="form-input mt-1 block w-full"
                    placeholder="john@example.com"
                  />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (date)</span>
                  <input type="date" class="form-input mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (datetime-local)</span>
                  <input type="datetime-local" class="form-input mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (month)</span>
                  <input type="month" class="form-input mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (number)</span>
                  <input type="number" class="form-input mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (search)</span>
                  <input type="search" class="form-input mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (time)</span>
                  <input type="time" class="form-input mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (week)</span>
                  <input type="week" class="form-input mt-1 block w-full" />
                </label>
              </div>
              <div class="grid grid-cols-1 gap-6">
                <label class="block">
                  <span class="text-gray-700">Input (tel)</span>
                  <input
                    type="tel"
                    multiple
                    class="form-input mt-1 block w-full"
                    placeholder="john@example.com"
                  />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (url)</span>
                  <input
                    type="url"
                    multiple
                    class="form-input mt-1 block w-full"
                    placeholder="john@example.com"
                  />
                </label>
                <label class="block">
                  <span class="text-gray-700">Select</span>
                  <select class="form-select block w-full mt-1">
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-gray-700">Select (single, with size)</span>
                  <select class="form-select block w-full mt-1" size="3">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                    <option>Option 4</option>
                    <option>Option 5</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-gray-700">Select (multiple)</span>
                  <select class="form-multiselect block w-full mt-1" multiple>
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                    <option>Option 4</option>
                    <option>Option 5</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-gray-700">Select (multiple, with size)</span>
                  <select class="form-multiselect block w-full mt-1" multiple size="3">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                    <option>Option 4</option>
                    <option>Option 5</option>
                  </select>
                </label>
                <label class="block">
                  <span class="text-gray-700">Textarea</span>
                  <textarea
                    class="form-textarea mt-1 block w-full h-24"
                    rows="3"
                    placeholder="Enter some long form content."
                  ></textarea>
                </label>
                <fieldset class="block">
                  <legend class="text-gray-700">Checkboxes</legend>
                  <div class="mt-2">
                    <div>
                      <label class="inline-flex items-center">
                        <input class="form-checkbox" type="checkbox" checked />
                        <span class="ml-2">Option 1</span>
                      </label>
                    </div>
                    <div>
                      <label class="inline-flex items-center">
                        <input class="form-checkbox" type="checkbox" />
                        <span class="ml-2">Option 2</span>
                      </label>
                    </div>
                    <div>
                      <label class="inline-flex items-center">
                        <input class="form-checkbox" type="checkbox" />
                        <span class="ml-2">Option 3</span>
                      </label>
                    </div>
                  </div>
                </fieldset>
                <fieldset class="block">
                  <legend class="text-gray-700">Radio Buttons</legend>
                  <div class="mt-2">
                    <div>
                      <label class="inline-flex items-center">
                        <input
                          class="form-radio"
                          type="radio"
                          checked
                          name="radio-direct"
                          value="1"
                        />
                        <span class="ml-2">Option 1</span>
                      </label>
                    </div>
                    <div>
                      <label class="inline-flex items-center">
                        <input class="form-radio" type="radio" name="radio-direct" value="2" />
                        <span class="ml-2">Option 2</span>
                      </label>
                    </div>
                    <div>
                      <label class="inline-flex items-center">
                        <input class="form-radio" type="radio" name="radio-direct" value="3" />
                        <span class="ml-2">Option 3</span>
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <div class="max-w-4xl mx-auto py-12">
            <h2 class="text-2xl font-bold">Untouched</h2>
            <p class="mt-2 text-lg text-gray-500">
              These are form elements we don't handle (yet?), but we use this to make sure we
              haven't accidentally styled them by mistake.
            </p>
            <div class="mt-8 grid grid-cols-2 gap-6 items-start">
              <div class="grid grid-cols-1 gap-6">
                <label class="block">
                  <span class="text-gray-700">Input (range)</span>
                  <input type="range" class="mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (color)</span>
                  <input type="color" class="mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (file)</span>
                  <input type="file" class="mt-1 block w-full" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Input (file, multiple)</span>
                  <input type="file" multiple class="mt-1 block w-full" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
