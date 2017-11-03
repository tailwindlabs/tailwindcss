---
extends: _layouts.documentation
title: "Forms"
---

# Forms

<div class="mt-8">
  <div class="bg-blue-lightest border-l-4 border-blue-light rounded-b text-blue-darkest px-4 py-3">
    <div class="flex">
      <div class="py-1">
        <svg class="h-6 w-6 text-blue-light mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-.5-5h1c.276 0 .5.224.5.5v1c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-1c0-.276.224-.5.5-.5zm0-8h1c.276 0 .5.224.5.5V8l-.5 3-1 .5L9 8V5.5c0-.276.224-.5.5-.5z"/></svg>
      </div>
      <div>
        <p class="font-semibold">Work in progress!</p>
        <p class="text-sm">More detailed examples are coming soon.</p>
      </div>
    </div>
  </div>
</div>

## Login Form

@component('_partials.code-sample', ['class' => 'px-3 py-10 bg-grey-lighter flex justify-center'])
<div class="w-full max-w-xs">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
            <label class="block text-grey-darker font-bold mb-2" for="username">
                Username
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-dark" id="username" type="text" placeholder="Username">
        </div>
        <div class="mb-6">
            <label class="block text-grey-darker font-bold mb-2" for="username">
                Password
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-dark" id="password" type="password" placeholder="******************">
        </div>
        <div class="flex items-center justify-between">
            <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded" type="button">
                Sign In
            </button>
            <a class="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
                Forgot Password?
            </a>
        </div>
    </form>
    <p class="text-center text-grey text-xs">
        &copy;{{ date('Y') }} Acme Corp. All rights reserved.
    </p>
</div>
@endcomponent

## Inline Form

@component('_partials.code-sample', ['class' => 'flex justify-center p-8'])
<form class="w-full max-w-xs">
    <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
            <label class="block text-slate-light font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                Full Name
            </label>
        </div>
        <div class="md:w-2/3">
            <input class="bg-grey-lighter appearance-none border-2 border-grey-lighter hover:border-purple rounded w-full py-2 px-4 text-grey-dark" id="inline-full-name" type="text" value="Jane Doe">
        </div>
    </div>
    <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
            <label class="block text-slate-light font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-username">
                Password
            </label>
        </div>
        <div class="md:w-2/3">
            <input class="bg-grey-lighter appearance-none border-2 border-grey-lighter hover:border-purple rounded w-full py-2 px-4 text-grey-dark" id="inline-username" type="password" placeholder="******************">
        </div>
    </div>
    <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3"></div>
        <label class="md:w-2/3 block text-slate-light font-bold">
            <input class="mr-2" type="checkbox">
            <span class="text-sm">
                Send me your newsletter!
            </span>
        </label>
    </div>
    <div class="md:flex md:items-center">
        <div class="md:w-1/3"></div>
        <div class="md:w-2/3">
            <button class="shadow bg-purple hover:bg-purple-light text-white font-bold py-2 px-4 rounded" type="button">
                Sign Up
            </button>
        </div>
    </div>
</form>
@endcomponent

## Form Grid

@component('_partials.code-sample', ['class' => 'flex justify-center p-8'])
<form class="w-full max-w-md">
    <div class="-mx-3 md:flex mb-6">
        <div class="md:w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase leading-loose text-slate text-xs font-bold mb-2" for="grid-full-name">
                First Name
            </label>
            <input class="appearance-none block w-full bg-grey-lighter text-slate border border-grey-lighter rounded py-3 px-4" id="grid-full-name" type="text" placeholder="Jane">
        </div>
        <div class="md:w-1/2 px-3">
            <label class="block uppercase leading-loose text-slate text-xs font-bold mb-2" for="grid-full-name">
                Last Name
            </label>
            <input class="appearance-none block w-full bg-grey-lighter text-slate border border-grey-lighter rounded py-3 px-4" id="grid-full-name" type="text" placeholder="Doe">
        </div>
    </div>
    <div class="-mx-3 md:flex mb-6">
        <div class="md:w-full px-3">
            <label class="block uppercase leading-loose text-slate text-xs font-bold mb-2" for="grid-username">
                Password
            </label>
            <input class="appearance-none block w-full bg-grey-lighter text-slate border border-grey-lighter rounded py-3 px-4" id="grid-username" type="password" placeholder="******************">
        </div>
    </div>
    <div class="-mx-3 md:flex mb-2">
        <div class="md:w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase leading-loose text-slate text-xs font-bold mb-2" for="grid-full-name">
                City
            </label>
            <input class="appearance-none block w-full bg-grey-lighter text-slate border border-grey-lighter rounded py-3 px-4" id="grid-full-name" type="text" placeholder="Albuquerque">
        </div>
        <div class="md:w-1/2 px-3">
            <label class="block uppercase leading-loose text-slate text-xs font-bold mb-2" for="grid-select">
                State
            </label>
            <select class="appearance-none block w-full bg-grey-lighter text-slate border border-grey-lighter rounded py-3 px-4" id="grid-select" style='background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAYAAAAMJL+VAAAABGdBTUEAALGPC/xhBQAAAQtJREFUOBG1lEEOgjAQRalbGj2OG9caOACn4ALGtfEuHACiazceR1PWOH/CNA3aMiTaBDpt/7zPdBKy7M/DCL9pGkvxxVp7KsvyJftL5rZt1865M+Ucq6pyyF3hNcI7Cuu+728QYn/JQA5yKaempxuZmQngOwEaYx55nu+1lQh8GIatMGi+01NwBcEmhxBqK4nAPZJ78K0KKFAJmR3oPp8+Iwgob0Oa6+TLoeCvRx+mTUYf/FVBGTPRwDkfLxnaSrRwcH0FWhNOmrkWYbE2XEicqgSa1J0LQ+aPCuQgZiLnwewbGuz5MGoAhcIkCQcjaTBjMgtXGURMVHC1wcQEy0J+Zlj8bKAnY1/UzDe2dbAVqfXn6wAAAABJRU5ErkJggg=="); background-position: right 0.8rem center; background-repeat: no-repeat; background-size: 0.8rem'>
                <option value="">New Mexico</option>
                <option value="">Missouri</option>
                <option value="">Texas</option>
            </select>
        </div>
        <div class="md:w-1/2 px-3">
            <label class="block uppercase leading-loose text-slate text-xs font-bold mb-2" for="grid-full-name">
                Zip
            </label>
            <input class="appearance-none block w-full bg-grey-lighter text-slate border border-grey-lighter rounded py-3 px-4" id="grid-full-name" type="text" placeholder="Jane Doe">
        </div>
    </div>
</form>
@endcomponent


## Underline Form

@component('_partials.code-sample', ['class' => 'flex justify-center p-8'])
<form class="w-full max-w-sm">
    <div class="flex items-center border-b border-b-2 border-teal py-2">
        <input class="appearance-none bg-transparent border-none w-full text-grey-dark mr-3 py-1 px-2" id="inline-full-name" type="text" placeholder="Jane Doe">
        <button class="bg-teal hover:bg-teal-dark border-teal hover:border-teal-dark text-sm border-4 text-white py-1 px-2 rounded" type="button">
            Sign&nbsp;Up
        </button>
        <button class="border-transparent border-4 text-teal hover:text-teal-darker text-sm py-1 px-2 rounded" type="button">
            Cancel
        </button>
    </div>
</form>
@endcomponent
