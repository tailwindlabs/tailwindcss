@extends('_layouts.master')

@section('body')
<h1 class="markdown">Examples</h1>

<p class="markdown">Some component examples, just to get a vibe for what's possible and for us to double check our default utilities are producing good looking stuff!</p>

<h2 class="markdown">Alerts</h2>

<div class="bg-red-lightest border border-red-light rounded p-4 mb-4">
    <div class="text-medium text-red-dark">
        Alert message
    </div>
    <div class="text-red-dark">
        Some additional text to explain what happened.
    </div>
</div>

<div class="bg-orange-lightest border border-orange-light rounded p-4 mb-4">
    <div class="text-medium text-orange-dark">
        Alert message
    </div>
    <div class="text-orange-dark">
        Some additional text to explain what happened.
    </div>
</div>


<div class="bg-yellow-lightest border border-yellow-light rounded p-4 mb-4">
    <div class="text-medium text-yellow-dark">
        Alert message
    </div>
    <div class="text-yellow-dark">
        Some additional text to explain what happened.
    </div>
</div>

<div class="bg-green-lightest border border-green-light rounded p-4 mb-4">
    <div class="text-medium text-green-dark">
        Alert message
    </div>
    <div class="text-green-dark">
        Some additional text to explain what happened.
    </div>
</div>

<div class="bg-teal-lightest border border-teal-light rounded p-4 mb-4">
    <div class="text-medium text-teal-dark">
        Alert message
    </div>
    <div class="text-teal-dark">
        Some additional text to explain what happened.
    </div>
</div>

<div class="bg-blue-lightest border border-blue-light rounded p-4 mb-4">
    <div class="text-medium text-blue-dark">
        Alert message
    </div>
    <div class="text-blue-dark">
        Some additional text to explain what happened.
    </div>
</div>

<div class="bg-indigo-lightest border border-indigo-light rounded p-4 mb-4">
    <div class="text-medium text-indigo-dark">
        Alert message
    </div>
    <div class="text-indigo-dark">
        Some additional text to explain what happened.
    </div>
</div>

<div class="bg-purple-lightest border border-purple-light rounded p-4 mb-4">
    <div class="text-medium text-purple-dark">
        Alert message
    </div>
    <div class="text-purple-dark">
        Some additional text to explain what happened.
    </div>
</div>

<div class="bg-pink-lightest border border-pink-light rounded p-4 mb-4">
    <div class="text-medium text-pink-dark">
        Alert message
    </div>
    <div class="text-pink-dark">
        Some additional text to explain what happened.
    </div>
</div>

<h2 class="markdown">Buttons</h2>

<div class="mb-4">
    <button class="text-medium text-dark rounded py-2 px-4 bg-light mr-4">
        Save
    </button>
    <button class="text-medium text-dark rounded py-2 px-4 bg-light-soft mr-4">
        Save
    </button>
    <button class="text-medium text-dark rounded py-2 px-4 bg-light-softer mr-4">
        Save
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-dark hover-bg-dark-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-dark-soft mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-dark-softer mr-4">
        Save
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-red hover-bg-red-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-red-light mr-4">
        Disabled
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-orange hover-bg-orange-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-orange-light mr-4">
        Disabled
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-yellow hover-bg-yellow-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-yellow-light mr-4">
        Disabled
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-green hover-bg-green-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-green-light mr-4">
        Disabled
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-teal hover-bg-teal-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-teal-light mr-4">
        Disabled
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-blue hover-bg-blue-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-blue-light mr-4">
        Disabled
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-indigo hover-bg-indigo-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-indigo-light mr-4">
        Disabled
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-purple hover-bg-purple-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-purple-light mr-4">
        Disabled
    </button>
</div>
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-pink hover-bg-pink-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-pink-light mr-4">
        Disabled
    </button>
</div>

<h2 class="markdown">Cards</h2>

<div class="constrain-sm mb-8">
    <div class="rounded overflow-hidden shadow-3">
        <img class="fit w-full" src="/img/card-top.jpg" alt="">
        <div class="px-6 py-4">
            <h2 class="text-xl mb-2">The Coldest Sunset</h2>
            <p class="text-dark-soft text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
        </div>
        <div class="px-6 py-4">
            <span class="inline-block bg-light-softer pill px-3 py-1 text-sm text-medium text-dark-soft mr-2">#photography</span>
            <span class="inline-block bg-light-softer pill px-3 py-1 text-sm text-medium text-dark-soft mr-2">#travel</span>
            <span class="inline-block bg-light-softer pill px-3 py-1 text-sm text-medium text-dark-soft">#winter</span>
        </div>
    </div>
</div>

<div class="constrain-md">
    <div class="flex">
        <div class="rounded-l w-128 text-center overflow-hidden">
            <img class="h-64" src="/img/card-left.jpg" alt="">
        </div>
        <div class="border-t border-r border-b border-dark-softer rounded-r p-4">
            <div class="mb-12">
                <p class="text-sm text-dark-softer flex-y-center">
                    <svg class="text-dark-softest w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"/></svg>
                    Members only
                </p>
                <h2 class="text-xl mb-2">Is your coffee giving you hemorrhoids?</h2>
                <p class="text-dark-soft text-base">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                </p>
            </div>
            <div class="flex-y-center">
                <img class="w-10 h-10 pill mr-4" src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg" alt="">
                <div class="text-sm">
                    <p class="text-dark leading-none">Jonathan Reinink</p>
                    <p class="text-dark-softer">Aug 18</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
