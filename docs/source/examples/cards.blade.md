---
extends: _layouts.markdown
title: "Cards"
---

# Cards

We don't ship alert components because every app has it's own visual style, but they are easy af to make.

<div class="max-w-sm mb-8">
    <div class="rounded overflow-hidden shadow-lg">
        <img class="fit w-full" src="/img/card-top.jpg" alt="">
        <div class="px-6 py-4">
            <h2 class="text-xl mb-2">The Coldest Sunset</h2>
            <p class="text-slate text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
            </p>
        </div>
        <div class="px-6 py-4">
            <span class="inline-block bg-smoke-light rounded-pill px-3 py-1 text-sm text-medium text-slate mr-2">#photography</span>
            <span class="inline-block bg-smoke-light rounded-pill px-3 py-1 text-sm text-medium text-slate mr-2">#travel</span>
            <span class="inline-block bg-smoke-light rounded-pill px-3 py-1 text-sm text-medium text-slate">#winter</span>
        </div>
    </div>
</div>

<div class="max-w-md">
    <div class="flex">
        <div class="rounded-l w-128 text-center overflow-hidden">
            <img class="h-64" src="/img/card-left.jpg" alt="">
        </div>
        <div class="border-t border-r border-b border-smoke rounded-r p-4 flex flex-col justify-between">
            <div>
                <p class="text-sm text-slate-light flex items-center">
                    <svg class="text-slate-lighter w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"/></svg>
                    Members only
                </p>
                <h2 class="text-xl mb-2">Is your coffee giving you hemorrhoids?</h2>
                <p class="text-slate text-base">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                </p>
            </div>
            <div class="flex items-center">
                <img class="w-10 h-10 rounded-pill mr-4" src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg" alt="">
                <div class="text-sm">
                    <p class="text-slate-darker leading-none">Jonathan Reinink</p>
                    <p class="text-slate-light">Aug 18</p>
                </div>
            </div>
        </div>
    </div>
</div>
