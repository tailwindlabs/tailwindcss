var postcss = require('postcss')

import plugin from '../src/lib/substituteClassApplyAtRules'

function run(input, opts) {
    return postcss([plugin(opts)]).process(input)
}

test("it copies a class's declarations into itself", () => {
    const output = '.a { color: red; } .b { color: red; }'

    return run('.a { color: red; } .b { @apply .a; }', {}).then(result => {
        expect(result.css).toEqual(output)
        expect(result.warnings().length).toBe(0)
    })
})

test("it doesn't copy a media query definition into itself", () => {
    const output = `.a {
            color: red;
        }

        @media (min-width: 300px) {
            .a { color: blue; }
        }

        .b {
            color: red;
        }`

    return run(
        `.a {
            color: red;
        }

        @media (min-width: 300px) {
            .a { color: blue; }
        }

        .b {
            @apply .a;
        }`,
        {}
    ).then(result => {
        expect(result.css).toEqual(output)
        expect(result.warnings().length).toBe(0)
    })
})

test('it fails if the class does not exist', () => {
    run('.b { @apply .a; }', {}).catch(error => {
        expect(error.reason).toEqual('No .a class found.')
    })
})
