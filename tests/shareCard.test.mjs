import { test } from 'node:test'
import assert from 'node:assert/strict'
import ts from 'typescript'
import { readFileSync } from 'node:fs'
const encode = text => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`
const levels = encode(ts.transpileModule(readFileSync('src/data/fortuneLevels.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText)
const source = ts.transpileModule(readFileSync('src/share/shareCard.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText.replace('../data/fortuneLevels', levels)
const { downloadFortuneCard } = await import(encode(source))
const context = new Proxy({}, { get: (_, key) => key === 'measureText' ? text => ({ width: text.length * 20 }) : key.toString().startsWith('create') ? () => ({ addColorStop() {} }) : () => {}, set: () => true })
const report = { timestamp: Date.now(), level: 'ji', levelLabel: '吉', headline: '组会正常运行', metrics: { mentorAttention: 20, pptSurvival: 60, taskDropRate: 30 }, goodFor: '汇报', avoid: '挖坑', talisman: '备份', actionAdvice: '准备数据' }
let blobResult = null
let clicked = false
globalThis.document = { createElement: tag => tag === 'canvas' ? { getContext: () => context, toBlob: callback => callback(blobResult) } : { click() { clicked = true }, remove() {} }, body: { appendChild() {}, removeChild() {} } }
globalThis.window = { setTimeout: () => 1, clearTimeout() {} }
test('export rejects when PNG encoding returns no image', async () => {
  await assert.rejects(async () => await downloadFortuneCard(report), /图片|生成|编码/)
})
test('export resolves only after a PNG download is triggered', async () => {
  blobResult = new Blob(['png'], { type: 'image/png' })
  const result = downloadFortuneCard(report)
  assert.equal(typeof result?.then, 'function')
  await result
  assert.equal(clicked, true)
})

