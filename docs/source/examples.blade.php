@extends('_layouts.master')

@section('body')
<h1 class="markdown">Examples</h1>

<p class="markdown">Some component examples, just to get a vibe for what's possible and for us to double check our default utilities are producing good looking stuff!</p>

<h2 class="markdown">Alerts</h2>

@foreach($page->colors as $color)
<div class="bg-{{$color}}-lightest border border-{{$color}}-light rounded p-4 mb-4">
    <div class="text-bold text-{{$color}}-dark">
        Alert message
    </div>
    <div class="text-{{$color}}-dark">
        Some additional text to explain what happened.
    </div>
</div>
@endforeach

<h2 class="markdown">Buttons</h2>

<h3 class="markdown">Solid</h3>

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
    <button class="text-medium text-light rounded py-2 px-4 bg-dark @bg-dark-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-dark-soft mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-dark-softer mr-4">
        Save
    </button>
</div>

@foreach($page->colors as $color)
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 bg-{{$color}} @bg-{{$color}}-dark mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 bg-{{$color}}-light mr-4">
        Disabled
    </button>
</div>
@endforeach

<h3 class="markdown">Outline</h3>

@foreach($page->colors as $color)
<div class="mb-4">
    <button class="text-medium text-light rounded py-2 px-4 text-{{$color}}-dark @text-light border border-{{$color}} @bg-{{$color}} mr-4">
        Save
    </button>
    <button class="text-medium text-light rounded py-2 px-4 text-{{$color}}-light border border-{{$color}}-light mr-4">
        Disabled
    </button>
</div>
@endforeach

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
        <div class="border-t border-r border-b border-dark-softer rounded-r p-4 flex-col flex-spaced">
            <div>
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
