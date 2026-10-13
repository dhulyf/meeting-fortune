import assert from 'node:assert/strict'
import test from 'node:test'
import { getScannerQuip } from '../src/data/scannerQuips.ts'

test('scanner can greet users with a playful nickname when enabled', (t) => {
  t.mock.method(Math, 'random', () => 0.999)
  assert.match(getScannerQuip(null, true), /二旬老人|论文在逃人员|实验室常驻嘉宾/)
})

test('turning nicknames off excludes nickname quips throughout the random range', (t) => {
  for (let index = 0; index < 100; index += 1) {
    t.mock.method(Math, 'random', () => index / 100)
    assert.doesNotMatch(getScannerQuip(null, false), /二旬老人|论文在逃人员|实验室常驻嘉宾/)
    t.mock.restoreAll()
  }
})

test('scanner avoids repeating its previous message with either setting', (t) => {
  t.mock.method(Math, 'random', () => 0.999)
  for (const enabled of [true, false]) {
    const previous = getScannerQuip(null, enabled)
    assert.notEqual(getScannerQuip(previous, enabled), previous)
  }
})
