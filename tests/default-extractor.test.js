import { promises as fs } from "fs"
import extract from '../src/lib/defaultExtractor'

test('Extract $input', async () => {
  const [input, output] = await Promise.all([
    fs.readFile(__dirname + '/arbitrary-values.test.html', 'utf8'),
    fs.readFile(__dirname + '/arbitrary-values.test.extractions.txt', 'utf8'),
  ])

  const expected = output.trim().split('\n')

  const extractions = [...new Set(extract(input.trim()))].sort()

  expect(extractions).toEqual(expected)
})
