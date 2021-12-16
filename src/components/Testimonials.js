import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

let testimonials = [
  // Column 1
  [
    {
      content: 'I feel like an idiot for not using Tailwind CSS until now.',
      url: 'https://twitter.com/ryanflorence/status/1187951799442886656',
      author: {
        name: 'Ryan Florence',
        role: 'Remix & React Training',
        avatar: require('@/img/avatars/ryan-florence.jpg').default,
      },
    },
    {
      content:
        'If I had to recommend a way of getting into programming today, it would be HTML + CSS with Tailwind CSS.',
      url: 'https://twitter.com/rauchg/status/1225611926320738304',
      author: {
        name: 'Guillermo Rauch',
        role: 'Vercel',
        avatar: require('@/img/avatars/guillermo-rauch.jpg').default,
      },
    },
    {
      content: `I have no design skills and with Tailwind I can actually make good looking websites with ease and it's everything I ever wanted in a CSS framework.`,
      author: {
        name: 'Sara Vieira',
        role: 'CodeSandbox',
        avatar: require('@/img/avatars/sara-vieira.jpg').default,
      },
    },
    {
      content: `Tailwind CSS is the greatest CSS framework on the planet.`,
      url: 'https://twitter.com/taylorotwell/status/1106539049202999296',
      author: {
        name: 'Bret "The Hitman" Hart',
        role: 'Former WWE Champion',
        avatar: require('@/img/avatars/bret-hart.jpg').default,
      },
    },
    {
      content: `I started using @tailwindcss. I instantly fell in love with their responsive modifiers, thorough documentation, and how easy it was customizing color palettes.`,
      url: 'https://twitter.com/dacey_nolan/status/1303744545587441666',
      author: {
        name: 'Dacey Nolan',
        role: 'Software Engineer',
        avatar: require('@/img/avatars/dacey-nolan.jpg').default,
      },
    },

    {
      content: 'Loved it the very moment I used it.',
      url: 'https://twitter.com/GTsurwa/status/1304226774491033601',
      author: {
        name: 'Gilbert Rabut Tsurwa',
        role: 'Web Developer',
        avatar: require('@/img/avatars/gilbert-rabut-tsurwa.jpg').default,
      },
    },
    {
      content:
        'There’s one thing that sucks about @tailwindcss - once you’ve used it on a handful of projects it is a real pain in the ass to write normal CSS again.',
      url: 'https://twitter.com/iamgraem_e/status/1322861404781748228',
      author: {
        name: 'Graeme Houston',
        role: 'JavaScript Developer',
        avatar: require('@/img/avatars/graeme-houston.jpg').default,
      },
    },

    {
      content: `Okay, I’m officially *all* in on the @tailwindcss hype train. Never thought building websites could be so ridiculously fast and flexible.`,
      url: 'https://twitter.com/lukeredpath/status/1316543571684663298',
      author: {
        name: 'Aaron Bushnell',
        role: 'Programmer @ TrendyMinds',
        avatar: require('@/img/avatars/aaron-bushnell.jpg').default,
      },
    },
    {
      content: 'Okay, @tailwindcss just clicked for me and now I feel like a #!@%&$% idiot.',
      url: 'https://twitter.com/ken_wheeler/status/1225373231139475458',
      author: {
        name: 'Ken Wheeler',
        role: `React Engineer`,
        avatar: require('@/img/avatars/ken-wheeler.jpg').default,
      },
    },
    {
      content: `I've been using @tailwindcss the past few months and it's amazing. I already used some utility classes before, but going utility-first... this is the way.`,
      url: 'https://twitter.com/JadLimcaco/status/1327417021915561984',
      author: {
        name: 'Jad Limcaco',
        role: 'Designer',
        avatar: require('@/img/avatars/jad-limcaco.jpg').default,
      },
    },
    {
      content: `After finally getting to use @tailwindcss on a real client project in the last two weeks I never want to write CSS by hand again. I was a skeptic, but the hype is real.`,
      url: 'https://twitter.com/lukeredpath/status/1316543571684663298',
      author: {
        name: 'Luke Redpath',
        role: 'Ruby & iOS Developer',
        avatar: require('@/img/avatars/luke-redpath.jpg').default,
      },
    },
    {
      content:
        "I didn't think I was going to like @tailwindcss... spent a day using it for a POC, love it! I wish this had been around when we started our company design system, seriously considering a complete rebuild",
      url: 'https://twitter.com/JonBloomer/status/1300923818622377984',
      author: {
        name: 'Jon Bloomer',
        role: 'Front-End Developer',
        avatar: require('@/img/avatars/jon-bloomer.jpg').default,
      },
    },
    {
      content: '@tailwindcss looked unpleasant at first, but now I’m hooked on it.',
      url: 'https://twitter.com/droidgilliland/status/1222733372855848961',
      author: {
        name: 'Andrew Gilliland',
        role: 'Front-End Developer',
        avatar: require('@/img/avatars/andrew-gilliland.jpg').default,
      },
    },

    // New 1
    {
      content: 'Once you start using tailwind, there is no going back.',
      url: 'https://twitter.com/pkspyder007/status/1463126688301158400',
      author: {
        name: 'Praveen Kumar',
        avatar: require('@/img/avatars/pkspyder007.jpg').default,
      },
    },
    {
      content:
        'I use @tailwindcss for every single project because it removes most of the annoyances of css and is multiple times quicker',
      url: 'https://twitter.com/fanduvasu/status/1443396529558011904',
      author: {
        name: 'Vasu Bansal',
        avatar: require('@/img/avatars/fanduvasu.jpg').default,
      },
    },
    {
      content:
        "It's changed the trajectory of my business. I'm able to design better looking, better performing, and more accessible components in 1/3 of the time.",
      url: 'https://twitter.com/lawjolla/status/1443295146959728643',
      author: {
        name: 'Dennis Walsh',
        avatar: require('@/img/avatars/lawjolla.jpg').default,
      },
    },
    {
      content:
        'My first tailwind project worked great but what really kicked ass was going back to it months later and saving so much time making new changes. I knew how everything fit together instantly.',
      url: 'https://twitter.com/ericlbarnes/status/1303814860879343618',
      author: {
        name: 'Eric L. Barnes',
        avatar: require('@/img/avatars/ericlbarnes.jpg').default,
      },
    },
    {
      content:
        "Tailwind looked like pure spaghetti until I used it in a real project. Now it's the only way I make websites. Simple, fast, scalable.",
      url: 'https://twitter.com/nicksaraev/status/1304200875758428160',
      author: {
        name: 'Nick Saraev',
        avatar: require('@/img/avatars/nicksaraev.jpg').default,
      },
    },
    {
      content:
        'Tailwind is a classic example of why you need to put preconceptions aside when evaluating tech. The experience and productivity is streets ahead of what you might have believed based on old school CSS thinking!',
      url: 'https://twitter.com/_lukebennett/status/1303744015943204867',
      author: {
        name: 'Luke Bennett',
        avatar: require('@/img/avatars/_lukebennett.jpg').default,
      },
    },
    {
      content:
        'TailwindCSS is a framework like no other. Rather than constraining you to a set design, it gives you the tools and the standardization to build exactly what you want.',
      url: 'https://twitter.com/carre_sam/status/1303750185663770625',
      author: {
        name: 'Sam Carré',
        avatar: require('@/img/avatars/carre_sam.jpg').default,
      },
    },
    {
      content:
        'I remember being horrified the first time I saw utility first css.  But these past months using Tailwind on an increasing number of projects has just been a joyful new way to build things on the web.',
      url: 'https://twitter.com/evanfuture/status/1303743551583514637',
      author: {
        name: 'Evan Payne',
        avatar: require('@/img/avatars/evanfuture.jpg').default,
      },
    },
    {
      content:
        "I was initially skeptical as I began using @tailwindcss, until I now needed to copy a @sveltejs component to a different location and I didn't need to worry about any of my styles breaking.",
      url: 'https://twitter.com/rotimi_best/status/1407010180760539136',
      author: {
        name: 'Rotimi Best',
        avatar: require('@/img/avatars/rotimi_best.jpg').default,
      },
    },
    {
      content: '@tailwindcss makes you better at CSS. Change my mind.',
      url: 'https://twitter.com/Dominus_Kelvin/status/1362891692634963973',
      author: {
        name: 'Kelvin Omereshone',
        avatar: require('@/img/avatars/Dominus_Kelvin.jpg').default,
      },
    },
    {
      content:
        "Awesome stuff! I'm no designer or front-end developer; until I found Tailwind last year I hadn't done any CSS since the early nineties. Tailwind, and Tailwind UI mean I can now create good looking front ends quickly, which is super empowering. Crazy impressive project.",
      url: 'https://twitter.com/JCMagoo/status/1443334891706454018',
      author: {
        name: 'John W Clarke',
        avatar: require('@/img/avatars/JCMagoo.jpg').default,
      },
    },
    {
      content:
        'I admit I was a big skeptic of @tailwindcss until last year. I thought "why would I ever type a million classes that just abstract single CSS properties?" By now, I feel like I\'m twice as productive when building UIs. It\'s really amazing.',
      url: 'https://twitter.com/tweetsofsumit/status/1460171778337083394',
      author: {
        name: 'Sumit Kumar',
        avatar: require('@/img/avatars/tweetsofsumit.jpg').default,
      },
    },
    {
      content:
        'I\'m nearing completion on my months-long project of rewriting my company\'s frontend in TypeScript and @tailwindcss. Still, every time I re-implement a component, I think, "Wow, that was way easier this time." Tailwind rocks.',
      url: 'https://twitter.com/mannieschumpert/status/1445868384869134336',
      author: {
        name: 'Mannie Schumpert',
        role: 'Co-Founder/CTO @LaunchPathInc',
        avatar: require('@/img/avatars/mannieschumpert.jpg').default,
      },
    },

    // New 2
    // {
    //   content:
    //     'As a lazy developer, I love that I can copy/paste HTML examples that use Tailwind CSS and it just works in my app.',
    //   url: 'https://twitter.com/adamwathan/status/1468648955240230918',
    //   author: {
    //     name: 'Mark Funk',
    //     role: 'UI Engineer at Netflix',
    //     avatar: require('@/img/avatars/.jpg').default,
    //   },
    // },
    {
      content:
        'With the amount of shipping we have to do, skipping the conversion of brainwaves to CSS, and being able to implement at the speed of thought using Tailwind, my life as a fullstack developer has never been more blissful.',
      url: 'https://twitter.com/0xholman/status/1468691614453227523',
      author: {
        name: 'Christian Holman',
        avatar: require('@/img/avatars/0xholman.jpg').default,
      },
    },
    {
      content:
        'Tailwind makes it easy to bring new developers into the frontend project without having to worry about the mental exercise of understanding ‘some’ developer’s class hierarchy and thought process behind it.',
      url: 'https://twitter.com/jilsonthomas/status/1468678743644327942',
      author: {
        name: 'Jilson Thomas',
        role: 'UI Designer/Developer',
        avatar: require('@/img/avatars/jilsonthomas.jpg').default,
      },
    },
    {
      content:
        'Tailwind has been a total game-changer for our dev team. It allows us to move faster, keep our UI consistent, and focus on the work we want to do instead of writing CSS.',
      url: 'https://twitter.com/jakeryansmith/status/1468668828041293831',
      author: {
        name: 'Jake Ryan Smith',
        role: 'Full-Stack Developer',
        avatar: require('@/img/avatars/jakeryansmith.jpg').default,
      },
    },
  ],
  // Column 2
  [
    {
      content:
        'Have been working with CSS for over ten years and Tailwind just makes my life easier. It is still CSS and you use flex, grid, etc. but just quicker to write and maintain.',
      url: 'https://twitter.com/debs_obrien/status/1243255468241420288',
      author: {
        name: `Debbie O'Brien`,
        role: 'Head Developer Advocate @ Bit',
        avatar: require('@/img/avatars/debbie-obrien.jpg').default,
      },
    },
    {
      content:
        'I’ve been writing CSS for over 20 years, and up until 2017, the way I wrote it changed frequently. It’s not a coincidence Tailwind was released the same year. It might look wrong, but spend time with it and you’ll realize semantic CSS was a 20 year mistake.',
      url: 'https://twitter.com/frontendben/status/1468687028036452363',
      author: {
        name: 'Ben Furfie',
        role: 'Developer',
        avatar: require('@/img/avatars/frontendben.jpg').default,
      },
    },
    {
      content: 'Tailwind makes writing code feel like I’m using a design tool.',
      url: 'https://twitter.com/didiercatz/status/1468657403382181901',
      author: {
        name: 'Didier Catz',
        role: 'Co-Founder @StyptApp',
        avatar: require('@/img/avatars/didiercatz.jpg').default,
      },
    },
    {
      content:
        'Tailwind CSS is bridging the gap between design systems and products. It’s becoming the defacto API for styling.',
      url: 'https://twitter.com/frontstuff_io/status/1468667263532339204',
      author: {
        name: 'Sarah Dayan',
        role: 'Staff Software Engineer @Algolia',
        avatar: require('@/img/avatars/frontstuff_io.jpg').default,
      },
    },
    {
      content: 'I never want to write regular CSS again. Only @tailwindcss.',
      url: 'https://twitter.com/trey/status/1457854984020762626',
      author: {
        name: 'Trey Piepmeier',
        role: 'Web Developer',
        avatar: require('@/img/avatars/trey.jpg').default,
      },
    },
    {
      content:
        'I came into my job wondering why the last dev would ever implement Tailwind into our projects, within days I was a Tailwind convert and use it for all of my personal projects.',
      url: 'https://twitter.com/maddiexcampbell/status/1303752658029740032',
      author: {
        name: 'Madeline Campbell',
        role: 'Full-Stack Developer',
        avatar: require('@/img/avatars/madeline-campbell.jpg').default,
      },
    },
    {
      content:
        'Tailwind made me enjoy frontend development again and gave me the confidence that I can realize any design - no matter how complex it may be.',
      url: 'https://twitter.com/marcelpociot/status/1468664587146956803',
      author: {
        name: 'Marcel Pociot',
        role: 'CTO at @beyondcode',
        avatar: require('@/img/avatars/marcelpociot.jpg').default,
      },
    },
    {
      content: 'Tailwind turned me into a complete stack developer.',
      url: 'https://twitter.com/lepikhinb/status/1468665237155074056',
      author: {
        name: 'Boris Lepikhin',
        role: 'Full-Stack Developer',
        avatar: require('@/img/avatars/lepikhinb.jpg').default,
      },
    },
    {
      content:
        "Tailwind is the easiest and simplest part of any project I work on. I can't imagine I'll build anything big without it.",
      url: 'https://twitter.com/assertchris/status/1468651427664908292',
      author: {
        name: 'Christopher Pitt',
        role: 'Developer',
        avatar: require('@/img/avatars/assertchris.png').default,
      },
    },
    {
      content:
        "Tailwind CSS has alleviated so many problems we've all become accustomed to with traditional CSS that it makes you wonder how you ever developed websites without it.",
      url: 'https://twitter.com/ChaseGiunta/status/1468658689569665026',
      author: {
        name: 'Chase Giunta',
        role: 'Developer',
        avatar: require('@/img/avatars/ChaseGiunta.jpg').default,
      },
    },
    {
      content:
        'Having used other CSS frameworks, I always come back to Tailwind CSS as it gives me the ability to create a consistent and easy to use design system in my projects. Thanks to Tailwind CSS I only need one cup of coffee to get started on a new project.',
      url: 'https://twitter.com/zaku_dev/status/1468666521895325697',
      author: {
        name: 'Ivan Guzman',
        role: 'Software Engineer',
        avatar: require('@/img/avatars/zaku_dev.png').default,
      },
    },
    {
      content:
        'I’ve been using TailwindCSS for many years, and yet they seem to still amaze us every year with the updates. It’s aided me in building websites super quickly, I could never go back to boring old CSS classes!',
      url: 'https://twitter.com/heychazza',
      author: {
        name: 'Charlie Joseph',
        role: 'Developer',
        avatar: require('@/img/avatars/heychazza.jpg').default,
      },
    },
    {
      content:
        'Tailwind CSS is a design system implementation in pure CSS. It is also configurable. It gives developers super powers. It allows them to build websites with a clean consistent UI out of the box. It integrates well with any web dev framework because it‘s just CSS! Genius.',
      url: 'https://twitter.com/kahliltweets/status/1468654856617476097',
      author: {
        name: 'Kahlil Lechelt',
        role: 'JavaScript Developer',
        avatar: require('@/img/avatars/kahliltweets.jpg').default,
      },
    },
    {
      content:
        'It’s super simple to slowly migrate to Tailwind from e.g. Bootstrap by using its prefix feature. Benefiting from its features while not having to spend a lot of time upfront is amazing!',
      url: 'https://twitter.com/MarcoSinghof/status/1468654001772244993',
      author: {
        name: 'Marco Singhof',
        role: 'Full-Stack Developer',
        avatar: require('@/img/avatars/MarcoSinghof.jpg').default,
      },
    },
    {
      content:
        'I wasn’t comfortable using CSS until I met Tailwind. Its easy to use abstraction combined with excellent documentation are a game changer!',
      url: 'https://twitter.com/joostmeijles/status/1468650757876555778',
      author: {
        name: 'Joost Meijles',
        role: 'Head of Unplatform @avivasolutions',
        avatar: require('@/img/avatars/joostmeijles.jpg').default,
      },
    },
    {
      content:
        "Tailwind turns implementing designs from a chore to a joy. You'll fall in love with building for the web all over again.",
      url: 'https://twitter.com/_swanson/status/1468653854199853057',
      author: {
        name: 'Matt Swanson',
        role: 'Developer',
        avatar: require('@/img/avatars/_swanson.jpg').default,
      },
    },
    {
      content:
        'Tailwind CSS helps you eject from the complexity of abstracting styles away. Having styles right there in your HTML is powerful, which gets even more obvious when using products like Tailwind UI.',
      url: 'https://twitter.com/silvenon/status/1468676092504551433',
      author: {
        name: 'Matija Marohnić',
        role: 'Front-End Developer',
        avatar: require('@/img/avatars/silvenon.jpg').default,
      },
    },
    {
      content:
        'If Tailwind is like Tachyons on steroids, Tailwind UI is like Lance Armstrong winning the Tour de France (seven times). Without, of course, the scandal and shame.',
      url: 'https://twitter.com/hughdurkin/status/1468658970848079872',
      author: {
        name: 'Hugh Durkin',
        role: 'Developer',
        avatar: require('@/img/avatars/hughdurkin.jpg').default,
      },
    },
    {
      content:
        'Being burned by other abandoned CSS frameworks, my biggest fear was to bet on yet another framework that may disappear. However, I gave it a try and couldn’t be happier. They keep improving the framework in meaningful ways on a regular basis. It feels very much alive.',
      url: 'https://twitter.com/wolax/status/1468653118443470848',
      author: {
        name: 'Matthias Schmidt',
        role: 'Programmer',
        avatar: require('@/img/avatars/wolax.jpg').default,
      },
    },
    {
      content:
        'Getting buy-in on TailwindCSS from our entire team of developers took some time and discussion, but once we implemented company wide, it has made it a breeze for any developer to jump into any project and quickly make changes/enhancements.',
      url: 'https://twitter.com/jerredchurst/status/1468657838494998530',
      author: {
        name: 'Jerred Hurst',
        role: 'CTO Primitive',
        avatar: require('@/img/avatars/jerredchurst.jpg').default,
      },
    },
    {
      content:
        "Tailwind CSS has at the same time made CSS enjoyable and drastically changed how I build out products. It's rapid, efficient and an absolute joy to work with.",
      url: 'https://twitter.com/braunshizzle/status/1468676003941830666',
      author: {
        name: 'Braunson Yager',
        role: 'Full Stack Developer & Designer',
        avatar: require('@/img/avatars/braunshizzle.jpg').default,
      },
    },
    {
      content:
        'Using any CSS framework other than Tailwind seems like a step backward in web development at this point. Absolutely nothing else comes close to making me as productive during the design phase of development than Tailwind.',
      url: 'https://twitter.com/zac_zajdel/status/1468662057079914499',
      author: {
        name: 'Zac Jordan Zajdel',
        role: 'Developer',
        avatar: require('@/img/avatars/zac_zajdel.jpg').default,
      },
    },
    {
      content:
        'Tailwind has completely revolutionized our devops pipeline. The CLI works consistently no matter what framework is in place.',
      url: 'https://twitter.com/joelvarty/status/1468671752356126728',
      author: {
        name: 'Joel Varty',
        role: 'President & CTO @agilitycms',
        avatar: require('@/img/avatars/joelvarty.jpg').default,
      },
    },
    {
      content:
        'Tailwind is like a really nice pair of socks. You think, “okay, how good can a pair of socks be”. Then you put socks on and you are like “%@#! these are socks”.',
      url: 'https://twitter.com/NeilDocherty/status/1468668979698937859',
      author: {
        name: 'Neil Docherty',
        role: 'Software Engineer',
        avatar: require('@/img/avatars/NeilDocherty.jpg').default,
      },
    },
    {
      content:
        'Tailwind unified our css work across different client projects more than any other methodology, while letting us keep our bespoke designs, and even improved performance and stability of our sites.',
      url: 'https://twitter.com/skttl/status/1468669231864725514',
      author: {
        name: 'Søren Kottal',
        role: 'Developer',
        avatar: require('@/img/avatars/skttl.jpg').default,
      },
    },
    {
      content: 'Tailwind is the only way to work with CSS at scale. ',
      url: 'https://twitter.com/aarondfrancis/status/1468696321607544840',
      author: {
        name: 'Aaron Francis',
        role: 'Developer',
        avatar: require('@/img/avatars/aarondfrancis.jpg').default,
      },
    },
    {
      content:
        "TailwindCSS has single-handedly been the biggest and most impactful change for our team's development workflow. I'm glad I live in a universe where Tailwind exists.",
      url: 'https://twitter.com/Megasanjay/status/1468674483099557890',
      author: {
        name: 'Sanjay Soundarajan',
        role: 'Front-End Developer',
        avatar: require('@/img/avatars/Megasanjay.jpg').default,
      },
    },
    {
      content:
        'Tailwind solves a complex problem in an elegant way. It provides a ready-to-use UI, all while not compromising on enabling developers to quickly build anything imaginable.',
      url: 'https://twitter.com/brentgarner/status/1468676369143926789',
      author: {
        name: 'Brent Garner',
        role: 'Developer',
        avatar: require('@/img/avatars/brentgarner.jpg').default,
      },
    },
  ],
  // Column 3
  [
    {
      content: 'Skip to the end. Use @tailwindcss.',
      url: 'https://twitter.com/kentcdodds/status/1468692023158796289',
      author: {
        name: 'Kent C. Dodds',
        role: 'Developer and Educator',
        avatar: require('@/img/avatars/kentcdodds.jpg').default,
      },
    },
    {
      content:
        'I was bad at front-end until I discovered Tailwind CSS. I have learnt a lot more about design and CSS itself after I started working with Tailwind. Creating web pages is 5x faster now.',
      url: 'https://twitter.com/shrutibalasa',
      author: {
        name: 'Shruti Balasa',
        role: 'Full Stack Web Developer & Tech Educator',
        avatar: require('@/img/avatars/shrutibalasa.jpg').default,
      },
    },
    {
      content: "I don't use it but if I would use something I'd use Tailwind!",
      url: 'https://twitter.com/levelsio/status/1288542608390856705',
      author: {
        name: 'Pieter Levels',
        role: 'Maker',
        avatar: require('@/img/avatars/levelsio.jpg').default,
      },
    },
    {
      content:
        'With Tailwind I can offer my clients faster turnaround times on custom WordPress themes, both for initial builds and for future revisions.',
      url: 'https://twitter.com/gregsvn/status/1468667690042617857',
      author: {
        name: 'Greg Sullivan',
        role: 'WordPress Developer',
        avatar: require('@/img/avatars/gregsvn.jpg').default,
      },
    },
    {
      content: 'Thanks to @tailwindcss, CSS started to make sense to me.',
      url: 'https://twitter.com/enunomaduro/status/1468650695104647170',
      author: {
        name: 'Nuno Maduro',
        role: 'Core Team Member @laravelphp',
        avatar: require('@/img/avatars/enunomaduro.jpg').default,
      },
    },
    {
      content:
        "Tailwind clicked for me almost immediately. I can't picture myself writing another BEM class ever again. Happy user since the first public release! Productivity is at an all time high, thanks to @tailwindcss.",
      url: 'https://twitter.com/igor_randj/status/1468654576576380930',
      author: {
        name: 'Igor Randjelovic',
        role: 'Developer',
        avatar: require('@/img/avatars/igor_randj.jpg').default,
      },
    },
    {
      content:
        'CSS has always been the hardest part of offering a digital service. It made me feel like a bad developer. Tailwind gives me confidence in web development again. Their docs are my first port of call.',
      url: 'https://twitter.com/ohhdanm/status/1468653056988528643',
      author: {
        name: 'Dan Malone',
        role: 'Founder of @mawla_io',
        avatar: require('@/img/avatars/ohhdanm.jpg').default,
      },
    },
    {
      content:
        'I thought "Why would I need Tailwind CSS? I already know CSS and use Bootstrap", but after giving it a try I decided to switch all my projects to Tailwind.',
      url: 'https://twitter.com/sertxudev/status/1468660429715030019',
      author: {
        name: 'Sergio Peris',
        role: 'DevOps Engineer & Network Administrator',
        avatar: require('@/img/avatars/sertxudev.jpg').default,
      },
    },
    {
      content:
        'The Tailwind docs are its real magic. It is actually better documented than CSS itself. It’s such a pleasure to use.',
      url: 'https://twitter.com/zachknicker/status/1468662554658443264',
      author: {
        name: 'Zach Knickerbocker',
        role: 'Developer',
        avatar: require('@/img/avatars/zachknicker.jpg').default,
      },
    },
    {
      content:
        "I've never felt more confident designing and styling websites and web apps than when I've used TailwindCSS.",
      url: 'https://twitter.com/grossmeyer/status/1468671286415089666',
      author: {
        name: 'Glenn Meyer',
        role: 'Developer',
        avatar: require('@/img/avatars/grossmeyer.jpg').default,
      },
    },
    {
      content:
        'Tried it once, never looked back. Tailwindcss convert since 0.7 and it just keeps getting better and better.',
      url: 'https://twitter.com/Jan_DHollander/status/1468653579405770754',
      author: {
        name: "Jan D'Hollander",
        role: 'Front-End Developer',
        avatar: require('@/img/avatars/Jan_DHollander.jpg').default,
      },
    },
    {
      content:
        'If you work at an agency and deal with hundreds of unique sites, each of them having their own custom CSS is a nightmare. Do your future self a favor and use Tailwind!',
      url: 'https://twitter.com/waunakeesoccer1/status/1468736369757466625',
      author: {
        name: 'Andrew Brown',
        avatar: require('@/img/avatars/waunakeesoccer1.jpg').default,
      },
    },
    {
      content:
        'Before Tailwind CSS I was banging my head against the wall trying to make sense of my CSS spaghetti. Now I am banging my head against the wall wondering why I didn’t try it earlier. My head hurts and my wall has a big hole in it. But at least using CSS is pleasant again!',
      url: 'https://twitter.com/marckohlbrugge/status/1468731283400536071',
      author: {
        name: 'Marc Köhlbrugge',
        avatar: require('@/img/avatars/marckohlbrugge.jpg').default,
      },
    },
    {
      content:
        'I was skeptical at first and resisted for a long time but after doing the first projects with Tailwind CSS this year, normal CSS just feels wrong and slow.',
      url: 'https://twitter.com/davidhellmann/status/1468703979232272398',
      author: {
        name: 'David Hellmann',
        role: 'Digital Designer & Developer',
        avatar: require('@/img/avatars/davidhellmann.jpg').default,
      },
    },
    {
      content:
        "After using Tailwind for the first time, I wondered why I used anything else. It's now my go-to CSS framework for any application, production or prototype.",
      url: 'https://twitter.com/all_about_code/status/1468651643210240000',
      author: {
        name: 'Joshua Lowe',
        role: 'Developer',
        avatar: require('@/img/avatars/all_about_code.jpg').default,
      },
    },
    {
      content:
        'Tailwind not only made me able to focus on building great UI’s but it also improved my overall CSS skills by having such a wonderful docs site when I needed to handwrite CSS.',
      url: 'https://twitter.com/joshmanders/status/1468710484396359681',
      author: {
        name: 'Josh Manders',
        role: 'Developer',
        avatar: require('@/img/avatars/joshmanders.jpg').default,
      },
    },
    {
      content:
        'Using Tailwind is an accelerant for rapid prototyping design systems. Strong documentation, helpful community, and instant results.',
      url: 'https://twitter.com/igaenssley/status/1468674047328370690',
      author: {
        name: 'Ian Gaenssley',
        role: 'Design Operations Lead at BetterCloud',
        avatar: require('@/img/avatars/igaenssley.jpg').default,
      },
    },
    {
      content:
        'I instinctively hated utility CSS, but Tailwind completely converted me. It reignited my excitement for front-end development and implementing custom designs!',
      url: 'https://twitter.com/jessarchercodes/status/1468743738545434626',
      author: {
        name: 'Jess Archer',
        role: 'Full-Stack Developer',
        avatar: require('@/img/avatars/jessarchercodes.png').default,
      },
    },
    {
      content:
        'Tailwind CSS bridges the gap between design and dev more than anything else. It reintroduces context to development, limits cognitive load with choice architecture, grants access to a token library out of the box and is incredibly easy to pickup. It helped my design career so much.',
      url: 'https://twitter.com/CoreyGinnivan/status/1468698985435041794',
      author: {
        name: 'Corey Ginnivan',
        role: 'Co-Founder of FeatureBoard',
        avatar: require('@/img/avatars/CoreyGinnivan.jpg').default,
      },
    },
    {
      content:
        "When I'm working on a project that isn't using Tailwind, first I yell, then I take a deep breath, then I run npm install tailwindcss.",
      url: 'https://twitter.com/ryanchenkie/status/1468675898559840263',
      author: {
        name: 'Ryan Chenkie',
        avatar: require('@/img/avatars/ryanchenkie.jpg').default,
      },
    },
    {
      content:
        "Going back to a large website that doesn't use Tailwind is like hopping out of a Tesla and into my dad's rusted Minnesota farm truck. Sure, it works, but the clutch is slipping, the brakes barely work, and it's filled with old tires we're not even using anymore.",
      url: 'https://twitter.com/dangayle/status/1468738215431467008',
      author: {
        name: 'Dan Gayle',
        role: 'Senior Front-End Developer @CrateandBarrel',
        avatar: require('@/img/avatars/dangayle.jpg').default,
      },
    },
    {
      content:
        'I pushed back hard at the mention of Tailwind initially due to the number of classes in my code however within 5 minutes or using it I was hooked and now am the annoying guy pushing Tailwind on anyone who will listen. It has simplified my dev workflow beyond measurement.',
      url: 'https://twitter.com/dbrooking/status/1468718511040126982',
      author: {
        name: 'Dan Brooking',
        role: 'Head Engineer @SubscriptionBox',
        avatar: require('@/img/avatars/dbrooking.jpg').default,
      },
    },
    {
      content:
        'I never bothered to learn vanilla CSS because it’s a waste of time — why bother when I have Tailwind instead? Turns out I learned a ton of CSS anyway just by using Tailwind. It’s such a perfect middleground between thoughtful abstraction, while still letting you break free.',
      url: 'https://twitter.com/TrevorCampbell_/status/1468739918662930432',
      author: {
        name: 'Trevor Campbell',
        avatar: require('@/img/avatars/TrevorCampbell_.jpg').default,
      },
    },
    {
      content:
        "Tailwind and the ecosystem around it is like a giant turbocharger for web agencies. It helps teams of developers and designers develop a shared language and system of constraints that speeds up the entire process. It's a game-changer for efficient teamwork.",
      url: 'https://twitter.com/sagalbot/status/1468727120218103809',
      author: {
        name: 'Jeff Sagal',
        role: 'Full-Stack Developer',
        avatar: require('@/img/avatars/sagalbot.jpg').default,
      },
    },
    {
      content:
        'Tailwind provides the style of bespoke design, the constraint of a design system, and the flexibility to make it infinitely customizable, without being shoehorned into making every website look like it was cut from the same cloth.',
      url: 'https://twitter.com/michaeldyrynda/status/1468720374657392645',
      author: {
        name: 'Michael Dyrynda',
        role: 'Australian',
        avatar: require('@/img/avatars/michaeldyrynda.jpg').default,
      },
    },
    {
      content:
        'Tailwind completely changed my freelance career by allowing me to build out completely custom designs really fast without writing any CSS.',
      url: 'https://twitter.com/jasonlbeggs/status/1468666464911736835',
      author: {
        name: 'Jason Beggs',
        role: 'Front-End Developer',
        avatar: require('@/img/avatars/jasonlbeggs.jpg').default,
      },
    },
    {
      content: 'Using TailwindCSS will make you feel like you just unlocked a cheat code.',
      url: 'https://twitter.com/dpaluy/status/1468678245327454211',
      author: {
        name: 'David Paluy',
        role: 'CTO @Quartix',
        avatar: require('@/img/avatars/dpaluy.png').default,
      },
    },
    {
      content:
        'Every developer I’ve convinced to give Tailwind a try has come back and said they are never going back. Every. Single. One.',
      url: 'https://twitter.com/jacobgraf/status/1468931374245687298',
      author: {
        name: 'Jacob Graf',
        role: 'Web Developer',
        avatar: require('@/img/avatars/jacobgraf.jpg').default,
      },
    },
  ],
]

function Testimonial({ author, content, url, expanded }) {
  let [focusable, setFocusable] = useState(true)
  let ref = useRef()

  useEffect(() => {
    if (ref.current.offsetTop !== 0) {
      setFocusable(false)
    }
  }, [])

  return (
    <li ref={ref} className="text-sm leading-6">
      <figure className="relative flex flex-col-reverse bg-gray-50 rounded-lg p-6">
        <blockquote className="mt-6 text-gray-700">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </blockquote>
        <figcaption className="flex items-center space-x-4">
          <img
            src={author.avatar}
            alt=""
            className="flex-none w-14 h-14 rounded-full object-cover"
            loading="lazy"
          />
          <div className="flex-auto">
            <div className="text-base text-gray-900 font-semibold">
              {url ? (
                <a href={url} tabIndex={focusable || expanded ? 0 : -1}>
                  <span className="absolute inset-0" />
                  {author.name}
                </a>
              ) : (
                author.name
              )}
            </div>
            <div className="mt-0.5">{author.role}</div>
          </div>
        </figcaption>
      </figure>
    </li>
  )
}

export function Testimonials() {
  let ref = useRef()
  let [expanded, setExpanded] = useState(false)
  let [showCollapseButton, setShowCollapseButton] = useState(false)
  let [transition, setTransition] = useState(false)
  let { ref: inViewRef, inView } = useInView({ threshold: 0 })
  let initial = useRef(true)

  useIsomorphicLayoutEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    if (expanded) {
      ref.current.focus({ preventScroll: expanded })
    } else {
      ref.current.focus()
      ref.current.scrollIntoView()
    }
    if (expanded) {
      setShowCollapseButton(false)
    }
  }, [expanded])

  useEffect(() => {
    setTimeout(() => setTransition(expanded), 0)
  }, [expanded])

  useEffect(() => {
    if (!expanded || !inView) return
    function onScroll() {
      let bodyRect = document.body.getBoundingClientRect()
      let rect = ref.current.getBoundingClientRect()
      let middle = rect.top + rect.height / 4 - bodyRect.top - window.innerHeight / 2
      let isHalfWay = window.scrollY > middle
      if (showCollapseButton && !isHalfWay) {
        setShowCollapseButton(false)
      } else if (!showCollapseButton && isHalfWay) {
        setShowCollapseButton(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true })
    }
  }, [expanded, showCollapseButton, inView])

  return (
    <section
      ref={ref}
      tabIndex="-1"
      className="relative max-w-7xl mx-auto px-4 focus:outline-none sm:px-3 md:px-5"
    >
      <h2 className="sr-only">Testimonials</h2>
      <div
        ref={inViewRef}
        className={clsx(
          'grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3',
          !expanded && 'max-h-[33rem] overflow-hidden'
        )}
      >
        {testimonials.map((column, i) => (
          <ul
            key={i}
            className={clsx(
              'space-y-8',
              i === 1 && 'hidden sm:block',
              i === 2 && 'hidden lg:block'
            )}
          >
            {column.map((testimonial) => (
              <Testimonial key={testimonial.author.name} expanded={expanded} {...testimonial} />
            ))}
          </ul>
        ))}
      </div>
      <div
        className={clsx(
          'inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-32 pb-8 pointer-events-none',
          expanded ? 'sticky -mt-52' : 'absolute',
          transition && 'transition-opacity duration-300',
          expanded && (showCollapseButton ? 'opacity-100' : 'opacity-0')
        )}
      >
        <button
          type="button"
          className={clsx(
            'relative bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm text-white font-semibold h-12 px-6 rounded-lg flex items-center',
            transition && 'transition-transform',
            expanded && !showCollapseButton && 'translate-y-4',
            (!expanded || showCollapseButton) && 'pointer-events-auto'
          )}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Okay, I get the point' : 'Show more...'}
        </button>
      </div>
    </section>
  )
}
