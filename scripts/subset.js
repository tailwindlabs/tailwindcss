const path = require('path')
const exec = require('exec-sh').promise
const glob = require('glob')
const fs = require('fs')

const inDir = path.resolve(__dirname, '../src/fonts')
const outDir = path.resolve(inDir, 'generated')
const files = glob.sync(path.resolve(__dirname, '../src/fonts/*'), { nodir: true })

const subsets = {
  'Poppins-Regular': [
    'Size Guide',
    'Free shipping on all continental US orders.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mi ultrices non pharetra, eros enim. Habitant suspendisse ultricies.',
  ],
  'Poppins-Medium': ['In stock', 'XS', 'S', 'M', 'L', 'XL'],
  'Poppins-SemiBold': ['Kids Jumpsuit', 'Buy now', 'Add to bag'],
  'Poppins-Bold': ['$39.00'],
  'Poppins-ExtraBold': ['Poppins'],

  'TenorSans-Regular': ['Fancy Suit Jacket', '$600.00', 'In stock', 'Tenor Sans'],

  'RobotoMono-Regular': [
    'S',
    'M',
    'L',
    'XL',
    'Size Guide',
    'Free shipping on all continental US orders.',
    'Roboto Mono',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mi ultrices non pharetra, eros enim. Habitant suspendisse ultricies.',
  ],
  'RobotoMono-Medium': ['In stock'],
  'RobotoMono-Bold': ['Retro Shoe', '$89.00', 'XS', 'BUY NOW', 'ADD TO BAG'],
}

Promise.all(
  Object.keys(subsets).map((font) =>
    exec(
      `glyphhanger --css --family="${font}" --whitelist="${subsets[font]
        .join('')
        .replace(/(["$\\])/g, '\\$1')}" --formats=woff-zopfli,woff2 --subset=${font}.ttf`,
      { cwd: inDir }
    )
  )
).then(() => {
  const generatedFiles = glob
    .sync(path.resolve(inDir, '*'), { nodir: true })
    .filter((file) => !files.includes(file))

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {})
  }

  generatedFiles.forEach((file) => {
    if (file.endsWith('.css')) {
      fs.writeFileSync(
        file,
        fs
          .readFileSync(file, 'utf8')
          .replace(
            /@font-face {\s+font-family: ([^;]+);/,
            (m, family) => `.font {\n  font-family: ${family};\n}\n\n${m}`
          )
      )
    }
    fs.renameSync(file, path.resolve(outDir, path.basename(file).replace(/\.css$/, '.module.css')))
  })
})
